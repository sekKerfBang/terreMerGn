from django.urls import path
from .views import ConversationListView, FilConversationView, EnvoyerMessageView

urlpatterns = [
    path("conversations/", ConversationListView.as_view(), name="conversations"),
    path("fil/<int:user_id>/", FilConversationView.as_view(), name="fil"),
    path("envoyer/", EnvoyerMessageView.as_view(), name="envoyer"),
]
