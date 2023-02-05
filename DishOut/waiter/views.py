from django.shortcuts import render
from django.template.response import TemplateResponse
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from MainDatabase.models import Tables

'''This makes it so that to enter the pages after the @
You must be logged in and if not you are sent to the 
Login page'''
@login_required(login_url='/')
#Function to load page for the selection screen
def selectView(request):
    #loads user and checks if they are part of the waiter group
    user = request.user
    context = {
        'user' : user,
    }
    if user.groups.filter(name = 'Waiter').exists():
        #If they are the page is loaded
        return TemplateResponse(request,'SelectionScreen.html')
        #If not they are sent to a html page which says incorrect permissions
    else: return HttpResponse("Incorrect permissions")

#Checks that a user is logged in before running the tableStatus function
@login_required(login_url='/')
#Function to load page for the Table Status screen
def tableStatus(request):
    # Checks if a request has been sent and if it is using POST 
    #This will be used for changing the status
    if request.method == 'POST':
        #Gets table number out of the request 
        table_number = request.POST.get('table_number')
        #Gets the record of the table with that number
        table = Tables.objects.get(Table_Number = table_number)
        # Checks if the table status is equal to ready
        if table.Status == 'Ready':
            #If it is it changes it to waiting to order
            table.Status = 'Waiting to order'
        #Else it just keeps it the same
        else: table.Status = table.Status
        #Saves the changes to the database
        table.save()
    #Loads user data
    user = request.user
    #Loads all tables data
    tables = Tables.objects.all()
    #Adds tables data to the context
    context = {
        'tables':tables,
    }
    #Check to see if they are in the correct group
    if user.groups.filter(name = 'Waiter').exists():
        #If they are the page is loaded with the context data
        return TemplateResponse(request,'TableStatusScreen.html', context)
        #If not they are sent to a html page which says incorrect permissions
    else: return HttpResponse("Incorrect permissions")


