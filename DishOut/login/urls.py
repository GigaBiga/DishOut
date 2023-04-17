#login/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path('', views.loginView.get, name='login'),
] 