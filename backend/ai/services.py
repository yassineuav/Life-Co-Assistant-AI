import logging
from typing import List

from meals.models import Meal
from meals.serializers import MealSerializer

logger = logging.getLogger(__name__)

class AISuggester:
    """Simple placeholder AI suggester that can be swapped for real OpenAI integration."""

    @staticmethod
    def suggest_recipes(user, payload: dict) -> List[Meal]:
        logger.info("Mocking AI recipe suggestions", extra={'user_id': getattr(user, 'id', None)})
        base_recipe = {
            'title': 'Pantry Power Bowl',
            'description': 'A balanced bowl leveraging pantry staples for quick fuel.',
            'instructions': 'Mix, heat, and serve with your favorite sauce.',
            'prep_time_minutes': payload.get('time_limit_minutes', 20),
            'difficulty': 'EASY',
            'calories': payload.get('calorie_goal_per_meal'),
            'protein': 25,
            'carbs': 45,
            'fat': 12,
            'ai_generated': True,
            'ingredients': [
                {'name': item.get('name', 'ingredient'), 'quantity': item.get('quantity'), 'unit': item.get('unit', '')}
                for item in payload.get('ingredients', [])
            ] or [
                {'name': 'quinoa', 'quantity': 1, 'unit': 'cup'},
                {'name': 'black beans', 'quantity': 1, 'unit': 'cup'},
                {'name': 'avocado', 'quantity': 0.5, 'unit': 'piece'},
            ],
        }
        serializer = MealSerializer(data=base_recipe, context={'request': payload.get('request')})
        serializer.is_valid(raise_exception=True)
        meal = serializer.save(ai_generated=True)
        return [meal]
