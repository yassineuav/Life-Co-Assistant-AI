from rest_framework.routers import DefaultRouter
from .views import UserIngredientViewSet

router = DefaultRouter()
router.register('', UserIngredientViewSet, basename='user-ingredient')

urlpatterns = router.urls
