from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import UserIngredient
from .serializers import UserIngredientSerializer

class UserIngredientViewSet(viewsets.ModelViewSet):
    serializer_class = UserIngredientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserIngredient.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=False, methods=['post'])
    def bulk(self, request):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='upload-image')
    def upload_image(self, request):
        # Placeholder for future Celery-powered OCR pipeline
        mock_items = [
            {'free_text_name': 'tomato', 'quantity': 2, 'unit': 'pcs'},
            {'free_text_name': 'spinach', 'quantity': 1, 'unit': 'bag'},
        ]
        serializer = self.get_serializer(data=mock_items, many=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)
