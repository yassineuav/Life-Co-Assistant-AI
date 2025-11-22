from django.conf import settings
from django.db import models

class Ingredient(models.Model):
    name = models.CharField(max_length=128, unique=True)
    category = models.CharField(max_length=64, blank=True)
    default_unit = models.CharField(max_length=32, default='unit')

    def __str__(self):
        return self.name

class UserIngredient(models.Model):
    class Source(models.TextChoices):
        MANUAL = 'MANUAL', 'Manual'
        IMAGE_DETECTED = 'IMAGE_DETECTED', 'Image Detected'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.SET_NULL, null=True, blank=True)
    free_text_name = models.CharField(max_length=128, blank=True)
    quantity = models.FloatField(default=1)
    unit = models.CharField(max_length=32, default='unit')
    expires_at = models.DateTimeField(null=True, blank=True)
    source = models.CharField(max_length=32, choices=Source.choices, default=Source.MANUAL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.free_text_name or (self.ingredient.name if self.ingredient else '')
