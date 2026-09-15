from django.urls import path
from . import views

urlpatterns = [
    path("initier/<int:annonce_id>/", views.initier, name="paiement-initier"),
    path("callback/", views.callback, name="paiement-callback"),
    path("statut/<str:reference>/", views.statut, name="paiement-statut"),
    path("mes-achats/", views.mes_achats, name="paiement-mes-achats"),
]