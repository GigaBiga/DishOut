from django.shortcuts import render
from django.template.response import TemplateResponse
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse

'''This makes it so that to enter the pages after the @
You must be logged in and if not you are sent to the 
Login page'''
@login_required(login_url='')
#Function to load page for the selection screen
def selectView(request):
    #loads user and checks if they are part of the waiter group
    user = request.user
    if user.groups.filter(name = 'Waiter').exists():
        #If they are the page is loaded
        return TemplateResponse(request,'SelectionScreen.html')
        #If not they are sent to a html page which says incorrect permissions
    else: return HttpResponse("Incorrect permissions")

