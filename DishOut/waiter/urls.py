from django.urls import path
from . import views

urlpatterns = [
   path('', views.selectView, name='selectView'), 
   path('TableStatus', views.tableStatus, name='tableStatus'),
]

