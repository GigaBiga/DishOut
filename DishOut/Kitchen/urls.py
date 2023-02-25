from django.urls import path
from . import views

urlpatterns = [
   path('', views.kitchen, name='kitchen'), 
   path('progressOrder', views.progressOrder, name='progressOrder'),
]

