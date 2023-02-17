from django.shortcuts import render
from django.template.response import TemplateResponse
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from MainDatabase.models import Tables
# Used for when changing the status of a table to check the current time
from datetime import datetime
# Imports Jsonresponse so that a json response can be sent to the front end
from django.http import JsonResponse
# Imports the dish information 
from MainDatabase.models import Menu

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
            # Saves the current time
            now = datetime.now()
            # Sets up the format for how the time should be saved
            current_time = now.strftime("%H:%M:%S")
            # Changes the Timer_Status to the current time in that format
            table.Timer_Status = current_time
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

# Makes sure that you have to be login to make this API request
@login_required(login_url='/')
# Makes the function that returns a JSON with the table number and the timer of that table
def get_times(request):
    # gets all table numbers and timer statuses which don't have a status of ready
    data = Tables.objects.exclude(Status="Ready").values('Table_Number', 'Timer_Status')
    # Returns the tables as a JSON
    return JsonResponse(list(data), safe=False)


#Checks that a user is logged in before running the orderTaking function
@login_required(login_url='/')
def orderTaking(request):
    #Loads user data
    user = request.user
    # Gets all dish data from Menu table
    dishes = Menu.objects.all()
    # Gets all table numbers
    tables = Tables.objects.values('Table_Number')
    #Adds menu data and table numbers to the context
    context = {
        'dishes':dishes,
        'tables':tables,
    }
    #Check to see if they are in the correct group
    if user.groups.filter(name = 'Waiter').exists():
        #If they are the page is loaded with the context data
        return TemplateResponse(request,'OrderTakingSite.html', context)
        #If not they are sent to a html page which says incorrect permissions
    else: return HttpResponse("Incorrect permissions")

# Makes sure that you have to be login to make this API request
@login_required(login_url='/')
# Makes the function that returns a JSON with the information of the dishes
def get_dishInfo(request):
    # gets all the information for the dishes
    data = list(Menu.objects.values())
    # Returns the the dish info as a JSON
    return JsonResponse(list(data), safe=False)