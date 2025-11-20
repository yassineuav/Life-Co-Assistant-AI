from rest_framework import serializers

from pantry.models import UserIngredient
from .models import Meal, MealIngredient, MealPlan, ShoppingList, ShoppingListItem

class MealIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealIngredient
        fields = ['id', 'name', 'quantity', 'unit', 'is_optional']
        read_only_fields = ['id']

class MealSerializer(serializers.ModelSerializer):
    ingredients = MealIngredientSerializer(many=True)

    class Meta:
        model = Meal
        fields = [
            'id', 'title', 'description', 'instructions', 'prep_time_minutes', 'difficulty',
            'calories', 'protein', 'carbs', 'fat', 'ai_generated', 'ingredients'
        ]
        read_only_fields = ['id', 'ai_generated']

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients', [])
        user = self.context['request'].user
        meal = Meal.objects.create(created_by=user, **validated_data)
        for ing in ingredients_data:
            MealIngredient.objects.create(meal=meal, **ing)
        return meal

class MealPlanSerializer(serializers.ModelSerializer):
    meal = MealSerializer()

    class Meta:
        model = MealPlan
        fields = ['id', 'date', 'meal_type', 'servings', 'meal']
        read_only_fields = ['id']

class ShoppingListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingListItem
        fields = ['id', 'ingredient_name', 'quantity', 'unit', 'is_in_pantry', 'is_checked']
        read_only_fields = ['id']

class ShoppingListSerializer(serializers.ModelSerializer):
    items = ShoppingListItemSerializer(many=True)

    class Meta:
        model = ShoppingList
        fields = ['id', 'title', 'from_date', 'to_date', 'created_at', 'items']
        read_only_fields = ['id', 'created_at']

class MealSuggestionRequestSerializer(serializers.Serializer):
    ingredients = serializers.ListField(child=serializers.DictField(), allow_empty=False)
    servings = serializers.IntegerField(min_value=1, max_value=8, default=1)
    time_limit_minutes = serializers.IntegerField(min_value=5, max_value=120, default=30)
    diet_type = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    calorie_goal_per_meal = serializers.IntegerField(required=False)
    budget_level = serializers.CharField(required=False, allow_blank=True)

class PlanWeekRequestSerializer(serializers.Serializer):
    start_date = serializers.DateField()
    days = serializers.IntegerField(min_value=1, max_value=14, default=7)
    meals_per_day = serializers.ListField(child=serializers.CharField(), default=['LUNCH', 'DINNER'])
    budget_level = serializers.CharField(required=False, allow_blank=True)
    calorie_goal_per_day = serializers.IntegerField(required=False)

class PlanRangeQuerySerializer(serializers.Serializer):
    start_date = serializers.DateField()
    end_date = serializers.DateField()

class ShoppingListFromPlanSerializer(serializers.Serializer):
    start_date = serializers.DateField()
    end_date = serializers.DateField()

    def to_internal_value(self, data):
        return super().to_internal_value(data)
