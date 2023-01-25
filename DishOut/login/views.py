from django.http import HttpResponse
from django.template.response import TemplateResponse
from django.contrib.auth import login
from django.shortcuts import render, redirect
from django.views import View
from django.views.generic import TemplateView
import hashlib
from MainDatabase.models import Employees

class login(TemplateView, View):
    template_name = "index.html"
    def get(self, request):
        return TemplateResponse(request, 'index.html')

    def post(self,request):
        print(request.POST)
        if request.method == 'POST':
            Username = request.POST.get('Username')
            password = request.POST.get('Password')
            try:
                user = Employees.objects.get(Username=Username)
                if hashlib.sha256(password.encode()).hexdigest() == user.Password:
                    return HttpResponse('Logged in')
                else:
                    return HttpResponse('Incorrect password')
            except Employees.DoesNotExist:
                    return HttpResponse('Incorrect username/password')
                
