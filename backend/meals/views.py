from collections import defaultdict
from datetime import timedelta

from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from ai.services import AISuggester
from pantry.models import UserIngredient
from .models import Meal, MealPlan, ShoppingList, ShoppingListItem
from .serializers import (
    MealSerializer,
    MealSuggestionRequestSerializer,
    PlanRangeQuerySerializer,
    PlanWeekRequestSerializer,
    ShoppingListFromPlanSerializer,
    ShoppingListSerializer,
)


class MealViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Meal.objects.filter(created_by=self.request.user)

    @action(detail=False, methods=['post'], url_path='suggest')
    def suggest(self, request):
        payload_serializer = MealSuggestionRequestSerializer(data=request.data)
        payload_serializer.is_valid(raise_exception=True)
        payload = payload_serializer.validated_data
        payload['request'] = request
        meals = AISuggester.suggest_recipes(request.user, payload)
        return Response(MealSerializer(meals, many=True).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='plan-week')
    def plan_week(self, request):
        serializer = PlanWeekRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        start_date = data['start_date']
        meal_types = data['meals_per_day']
        created_plans = []
        meals = list(Meal.objects.filter(created_by=request.user)[:len(meal_types)]) or [
            AISuggester.suggest_recipes(request.user, {**data, 'request': request})[0]
        ]
        for day_offset in range(data['days']):
            for meal_type in meal_types:
                meal = meals[(day_offset + meal_types.index(meal_type)) % len(meals)]
                plan, _ = MealPlan.objects.update_or_create(
                    user=request.user,
                    date=start_date + timedelta(days=day_offset),
                    meal_type=meal_type,
                    defaults={'meal': meal, 'servings': 1},
                )
                created_plans.append(plan)
        return Response({'count': len(created_plans)})

    @action(detail=False, methods=['get'], url_path='plan')
    def plan(self, request):
        serializer = PlanRangeQuerySerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        plans = MealPlan.objects.filter(user=request.user, date__range=(data['start_date'], data['end_date']))
        grouped = defaultdict(list)
        for plan in plans:
            grouped[str(plan.date)].append(plan)
        response = {
            date: MealSerializer([p.meal for p in entries], many=True).data
            for date, entries in grouped.items()
        }
        return Response(response)

    @action(detail=False, methods=['post'], url_path='shopping-lists/from-plan')
    def shopping_from_plan(self, request):
        serializer = ShoppingListFromPlanSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        plans = MealPlan.objects.filter(user=request.user, date__range=(data['start_date'], data['end_date']))
        combined = defaultdict(lambda: {'quantity': 0, 'unit': ''})
        for plan in plans:
            for ingredient in plan.meal.ingredients.all():
                combined[ingredient.name]['quantity'] += ingredient.quantity or 0
                combined[ingredient.name]['unit'] = ingredient.unit
        pantry_items = {item.free_text_name for item in UserIngredient.objects.filter(user=request.user)}
        shopping_list = ShoppingList.objects.create(
            user=request.user,
            title=f"Shopping List {data['start_date']} - {data['end_date']}",
            from_date=data['start_date'],
            to_date=data['end_date'],
        )
        for name, info in combined.items():
            ShoppingListItem.objects.create(
                shopping_list=shopping_list,
                ingredient_name=name,
                quantity=info['quantity'] or None,
                unit=info['unit'],
                is_in_pantry=name in pantry_items,
            )
        return Response(ShoppingListSerializer(shopping_list).data, status=status.HTTP_201_CREATED)
