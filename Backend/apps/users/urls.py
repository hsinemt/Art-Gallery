from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    UserProfileView,
    UserListView,
    IsAdminView
)

app_name = 'users'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('list/', UserListView.as_view(), name='user-list'),
    path('is-admin/', IsAdminView.as_view(), name='is-admin'),
]