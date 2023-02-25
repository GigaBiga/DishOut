from django.template.response import TemplateResponse
from django.contrib.auth import login
from django.shortcuts import render, redirect
from django.views import View
from django.views.generic import TemplateView
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from django.contrib.auth.models import Group
from django.contrib.auth import logout


class loginView(TemplateView, View):
    template_name = "login.html"
    def get(self, request):
        return TemplateResponse(request, 'login.html')
    #When this view gets a request
    def post(self,request):
        #Check that it is a POST request
        if request.method == 'POST':
            #Save the requests username and password
            username = request.POST.get('username')
            password = request.POST.get('password')
            #Save the user if it exists
            user = authenticate(request, username=username, password=password)
            #Check if user variable is equal to none which checks if they are real
            if user is not None:
                #log them in
                login(request, user)
                #Check if they are part of one of the Waiter , Kitchen or Manager groups
                groups = user.groups.all()
                if groups.filter(name='Waiter').exists():
                    return redirect('waiter/')
                elif groups.filter(name='Kitchen').exists():
                    return redirect('kitchen/')
                elif groups.filter(name='Manager').exists():
                    return HttpResponse("Manager")
                else: return HttpResponse("No permission group assigned to this user")
            else:
                #Send the to a page to let them try again
                return HttpResponse("<h1>User Not Found</h1> <a href="">Try Again?</a>")

