from django.urls import path
from . import views

urlpatterns = [
   # Selection screen
   path('', views.selectView, name='selectView'), 
   # Table status screen
   path('TableStatus', views.tableStatus, name='tableStatus'),
   path('TableStatus/get_times', views.get_times),
   # Order taking screen
   path('OrderTaking', views.orderTaking, name='orderTaking'),
   path('OrderTaking/get_dishInfo', views.get_dishInfo, name='get_dishInfo'),
   path('OrderTaking/submitOrder', views.submitOrder, name='submitOrder'),
   path('OrderTaking/get_csrf', views.get_csrf, name='get_csrf'),
   # Ready dishes screen
   path('ReadyDishes', views.readyDishes, name='readyDishes'),
   path('ReadyDishes/takeOrder', views.takeOrder, name='takeOrder'),
   path('ReadyDishes/deliverOrder', views.deliverOrder, name='deliverOrder'),
   # Pay screen
   path('Pay', views.pay, name='pay'),
   path('Pay/payTable', views.payTable, name='payTable'),
]

