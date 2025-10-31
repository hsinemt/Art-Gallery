from django.urls import path
from . import views

urlpatterns = [
    path('', views.ReclamationListCreateView.as_view(), name='reclamation-list-create'),
    path('<int:pk>/', views.ReclamationDetailView.as_view(), name='reclamation-detail'),
    path('received/', views.ReclamationReceivedView.as_view(), name='reclamation-received'),
    path('sent/', views.ReclamationSentView.as_view(), name='reclamation-sent'),
]
