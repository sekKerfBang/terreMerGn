from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnnonceViewSet, CategorieViewSet
from .stats_views import StatsDashboardView

router = DefaultRouter()
router.register("categories", CategorieViewSet, basename="categorie")
router.register("", AnnonceViewSet, basename="annonce")

urlpatterns = [
    path("stats/", StatsDashboardView.as_view(), name="stats"),
    path("", include(router.urls)),
]
