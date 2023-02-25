# Imports the TemplateResponse so that a template can be sent to the front end
from django.template.response import TemplateResponse
# Imports the login required decorator so that only logged in users can access the page
from django.contrib.auth.decorators import login_required
# Imports the HttpResponse so that a response can be sent to the front end
from django.http import HttpResponse
# Imports the tables table
from MainDatabase.models import Tables
# Imports Jsonresponse so that a json response can be sent to the front end
from django.http import JsonResponse
# Imports the dish information 
from MainDatabase.models import Menu
# Imports the orders table
from MainDatabase.models import Orders
import json

# 
@login_required(login_url='/')
#Function to load page for the selection screen
def kitchen(request):
    #Gets the user
    user = request.user
    #Gets the orders with status of New Order, Preparing, Cooking and Ready
    orders = Orders.objects.filter(Status__in = ['New Order','Preparing','Cooking','Ready'])
    context = {
        'Orders' : orders,
    }
    #Checks if the user is in the kitchen group
    if user.groups.filter(name = 'Kitchen').exists():
        #If they are the page is loaded with the context
        return TemplateResponse(request,'KitchenPage.html',context)
        #If not they are sent to a html page which says incorrect permissions
    else: return HttpResponse("Incorrect permissions")

# Makes sure that you have to be login to make this API request
@login_required(login_url='/')
# Makes the function that receives the orderID and the status to change the order to
def progressOrder(request):
    if request.method == 'POST':
        # Converts the request from JSON to a python diciotnary
        data = json.loads(request.body)
        # Gets the orderID from the dictionary
        orderID = data['OrderID']
        # Gets the status from the dictionary
        status = data['Status']
        # Gets the order from the database
        order = Orders.objects.get(OrderID = orderID)
        # Changes the status of the order
        order.Status = status
        # Saves the order
        order.save()
        # Returns a success message to the front end
        return JsonResponse({'status': 'success'})