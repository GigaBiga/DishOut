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
# Imports the orders table
from MainDatabase.models import Orders
# Imports the delivery table
from MainDatabase.models import Delivery
# Imports the csrf token
from django.middleware.csrf import get_token
# Import the employee table
from MainDatabase.models import Employees

import json

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

# Makes sure that you have to be login to make this API request
@login_required(login_url='/')
# Makes the function gets JSON data from the front end and saves it to the database
def submitOrder(request):
    if request.method == 'POST':
        # Get the order data from the request
        order_data = json.loads(request.body)
        # Split the order data into the table number, dish id and note
        table_number = Tables.objects.get(Table_Number=int(order_data[0]))
        dish_id = Menu.objects.get(DishID= int(order_data[1]))
        note = order_data[2]
        # Create a new order with the data
        new_order = Orders(Table_Number=table_number, DishID=dish_id, Status= "New Order",Note=note)
        # Save the new order to the database
        new_order.save()
        # Loads the table that the order was made for
        table = Tables.objects.get(Table_Number=int(order_data[0]))
        # Changes the status of the table to waiting for order
        table.Status = "Waiting for order"
        # Changes the Total_To_Pay to increment by the price of the dish
        table.Total_To_Pay += dish_id.Price
        # Makes the Timer_Status equal to the current time
        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        table.Timer_Status = current_time
        # Saves the changes to the database
        table.save()
        # Return a success message to front end
        return JsonResponse({'status': 'success'})

# Makes sure that you have to be login to make this API request
@login_required(login_url='/')
# Makes the function that returns a JSON with the csrf token
def get_csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})

# Makes sure that you have to be login to access this page
@login_required(login_url='/')
# Makes the function that loads the page for the ready dish screen  
def readyDishes(request):
    #Loads user data
    user = request.user
    # Gets all orders that have a status of ready
    orders = Orders.objects.filter(Status="Ready")
    # Adds all records with the username of the user that is logged in from the delivery table
    delivery = Delivery.objects.filter(Username=user.username)
    # Adds the orders to the context
    context = {
        'orders':orders,
        'delivery':delivery,
    }
    #Check to see if they are in the correct group
    if user.groups.filter(name = 'Waiter').exists():
        #If they are the page is loaded with the context data
        return TemplateResponse(request,'ReadyDishScreen.html', context)
        #If not they are sent to a html page which says incorrect permissions
    else: return HttpResponse("Incorrect permissions")

# Makes sure that you have to be login to make this API request
@login_required(login_url='/')
# Makes the function that receives an OrderID and a Username and makes a record in the delivery table
def takeOrder(request):
    if request.method == 'POST':
        # Converts the request from JSON to a python diciotnary
        data = json.loads(request.body)
        # Gets the order id from the request 
        username = Employees.objects.get(Username = request.user.username)
        # Creates a new record in the delivery table
        new_delivery = Delivery(OrderID=Orders.objects.get(OrderID = data['OrderId']), Username=username)
        # Saves the new record to the database
        new_delivery.save()
        # Loads the order that was taken
        order = Orders.objects.get(OrderID=data['OrderId'])
        # Changes the status of the order to taken
        order.Status = "Taken"
        # Saves the changes to the database
        order.save()
        # Returns a success message to the front end
        return JsonResponse({'status': 'success'})

# Makes sure that you have to be login to make this API request
@login_required(login_url='/')
# Makes the function that receives an OrderID and a Username and removes them from the delivery table
def deliverOrder(request):
    if request.method == 'POST':
        # Converts the request from JSON to a python diciotnary
        data = json.loads(request.body)
        # Gets the order id from the request 
        username = Employees.objects.get(Username = request.user.username)
        # Removes the record from the delivery table with Username and OrderID
        delivery = Delivery.objects.filter(Username=username, OrderID=Orders.objects.get(OrderID = data['OrderId']))
        delivery.delete()
        # Loads the order that was taken
        order = Orders.objects.get(OrderID=data['OrderId'])
        # Changes the status of the order to taken
        order.Status = "Delivered"
        # Saves the changes to the database
        order.save()
        # Changes the status of the table to waiting to pay
        table = Tables.objects.get(Table_Number=order.Table_Number.Table_Number)
        table.Status = "Waiting to pay"
        # Saves the changes to the database
        table.save()
        # Returns a success message to the front end
        return JsonResponse({'status': 'success'})

# Makes sure that you have to be login to access this page
@login_required(login_url='/')
# Makes the function that loads the page for the pay screen
def pay(request):
    #Loads user data
    user = request.user
    # Loads all tables that have a status of waiting to pay
    tables = Tables.objects.filter(Status="Waiting to pay")
    # Adds the orders to the context
    context = {
        'tables':tables,
    }
    #Check to see if they are in the correct group
    if user.groups.filter(name = 'Waiter').exists():
        #If they are the page is loaded with the context data
        return TemplateResponse(request,'PayScreen.html', context)
        #If not they are sent to a html page which says incorrect permissions
    else: return HttpResponse("Incorrect permissions")

# Makes sure that you have to be login to make this API request
@login_required(login_url='/')
# Makes the function that receives a table number and changes the status of the table to ready and sets the total to pay to 0
def payTable(request):
    if request.method == 'POST':
        # Converts the request from JSON to a python diciotnary
        data = json.loads(request.body)
        # Gets the table number from the request 
        table_number = Tables.objects.get(Table_Number = data['TableNum'])
        # Changes the status of the table to ready
        table_number.Status = "Ready"
        # Sets the total to pay to 0
        table_number.Total_To_Pay = 0
        # Saves the changes to the database
        table_number.save()
        # Returns a success message to the front end
        return JsonResponse({'status': 'success'})