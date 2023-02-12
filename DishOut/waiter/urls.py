from django.urls import path
from . import views

urlpatterns = [
   path('', views.selectView, name='selectView'), 
   path('TableStatus', views.tableStatus, name='tableStatus'),
   path('TableStatus/get_times', views.get_times),
   path('OrderTaking', views.orderTaking, name='orderTaking'),
   path('OrderTaking/get_dishInfo', views.get_dishInfo, name='get_dishInfo')
]

