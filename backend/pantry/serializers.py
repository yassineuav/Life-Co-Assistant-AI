from rest_framework import serializers

from .models import Ingredient, UserIngredient

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'category', 'default_unit']

class UserIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(required=False, allow_null=True)

    class Meta:
        model = UserIngredient
        fields = [
            'id', 'ingredient', 'free_text_name', 'quantity', 'unit', 'expires_at', 'source',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'source']

    def create(self, validated_data):
        ingredient_data = validated_data.pop('ingredient', None)
        user = self.context['request'].user
        ingredient = None
        if ingredient_data:
            ingredient, _ = Ingredient.objects.get_or_create(**ingredient_data)
        return UserIngredient.objects.create(user=user, ingredient=ingredient, **validated_data)

    def update(self, instance, validated_data):
        ingredient_data = validated_data.pop('ingredient', None)
        if ingredient_data:
            ingredient, _ = Ingredient.objects.get_or_create(**ingredient_data)
            instance.ingredient = ingredient
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
