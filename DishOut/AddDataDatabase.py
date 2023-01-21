import csv
import io
#Starts django and sets the settings
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DishOut.settings')
import django
django.setup()

from MainDatabase.models import Menu
#Imports the file
with io.open('C:/Users/User/Desktop/Programing Project/DishOut/DishOut/Menu.csv','r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    next(reader) # To skip the headings
    #Loops through all the rows in the data 
    for row in reader:
        # each row is returned as an array so it is split up per each field
        menu = Menu(Name=row[0], Price=row[1],Num_Ordered = 0, Category=row[2])
        menu.save()




