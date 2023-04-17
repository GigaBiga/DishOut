#Dishout/urls.py
from django.urls import include
from django.contrib import admin
from django.urls import path, include
from login import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('',views.loginView.as_view()),
    path('admin/', admin.site.urls),
    path('waiter/',include('waiter.urls')),
    path('logout/',LogoutView.as_view(), name='logout'),
    path('kitchen/',include('Kitchen.urls')),
] 

