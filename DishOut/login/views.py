from django.template.response import TemplateResponse
from django.contrib.auth import login
from django.shortcuts import render, redirect
from django.views import View
from django.views.generic import TemplateView
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse

class login(TemplateView, View):
    template_name = "login.html"
    def get(self, request):
        return TemplateResponse(request, 'login.html')

    def post(self,request):
        if request.method == 'POST':
            username = request.POST.get('username')
            password = request.POST.get('password')

            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, username)
            else:
                return HttpResponse("<h1>User Not Found</h1> <a href="">Try Again?</a>")

                
