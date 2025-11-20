from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class DietType(models.TextChoices):
        OMNIVORE = 'OMNIVORE', 'Omnivore'
        VEGETARIAN = 'VEGETARIAN', 'Vegetarian'
        VEGAN = 'VEGAN', 'Vegan'
        HALAL = 'HALAL', 'Halal'
        KOSHER = 'KOSHER', 'Kosher'
        OTHER = 'OTHER', 'Other'

    class CookingSkill(models.TextChoices):
        BEGINNER = 'BEGINNER', 'Beginner'
        INTERMEDIATE = 'INTERMEDIATE', 'Intermediate'
        ADVANCED = 'ADVANCED', 'Advanced'

    class BudgetLevel(models.TextChoices):
        LOW = 'LOW', 'Low'
        MEDIUM = 'MEDIUM', 'Medium'
        HIGH = 'HIGH', 'High'

    email = models.EmailField(unique=True)
    time_zone = models.CharField(max_length=64, blank=True)
    country = models.CharField(max_length=64, blank=True)
    diet_type = models.CharField(max_length=16, choices=DietType.choices, blank=True)
    cooking_skill = models.CharField(max_length=16, choices=CookingSkill.choices, blank=True)
    budget_level = models.CharField(max_length=16, choices=BudgetLevel.choices, blank=True)
    calorie_goal = models.PositiveIntegerField(null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
