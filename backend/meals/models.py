from django.conf import settings
from django.db import models

from pantry.models import Ingredient

class Meal(models.Model):
    class Difficulty(models.TextChoices):
        EASY = 'EASY', 'Easy'
        MEDIUM = 'MEDIUM', 'Medium'
        HARD = 'HARD', 'Hard'

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    instructions = models.TextField(blank=True)
    prep_time_minutes = models.PositiveIntegerField(default=15)
    difficulty = models.CharField(max_length=16, choices=Difficulty.choices, default=Difficulty.EASY)
    calories = models.IntegerField(null=True, blank=True)
    protein = models.FloatField(null=True, blank=True)
    carbs = models.FloatField(null=True, blank=True)
    fat = models.FloatField(null=True, blank=True)
    ai_generated = models.BooleanField(default=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class MealIngredient(models.Model):
    meal = models.ForeignKey(Meal, related_name='ingredients', on_delete=models.CASCADE)
    name = models.CharField(max_length=128)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.FloatField(null=True, blank=True)
    unit = models.CharField(max_length=32, blank=True)
    is_optional = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.quantity or ''} {self.unit})"

class MealPlan(models.Model):
    class MealType(models.TextChoices):
        BREAKFAST = 'BREAKFAST', 'Breakfast'
        LUNCH = 'LUNCH', 'Lunch'
        DINNER = 'DINNER', 'Dinner'
        SNACK = 'SNACK', 'Snack'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    meal_type = models.CharField(max_length=16, choices=MealType.choices)
    servings = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('user', 'date', 'meal_type')

class ShoppingList(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    from_date = models.DateField(null=True, blank=True)
    to_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ShoppingListItem(models.Model):
    shopping_list = models.ForeignKey(ShoppingList, related_name='items', on_delete=models.CASCADE)
    ingredient_name = models.CharField(max_length=128)
    quantity = models.FloatField(null=True, blank=True)
    unit = models.CharField(max_length=32, blank=True)
    is_in_pantry = models.BooleanField(default=False)
    is_checked = models.BooleanField(default=False)
