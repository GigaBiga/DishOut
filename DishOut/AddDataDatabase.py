import csv
import io
#Starts django and sets the settings
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DishOut.settings')
import django
django.setup()

from MainDatabase.models import Tables
from datetime import datetime

now = datetime.now()

current_time = now.strftime("%H:%M:%S")

#Imports the file
# with io.open('C:/Users/User/Desktop/Programing Project/DishOut/DishOut/Menu.csv','r', encoding='utf-8-sig') as f:
#     reader = csv.reader(f)
#     next(reader) # To skip the headings
#     #Loops through all the rows in the data 
#     for row in reader:
#         # each row is returned as an array so it is split up per each field
#         menu = Menu(Name=row[0], Price=row[1],Num_Ordered = 0, Category=row[2])
#         menu.save()

for i in range(1,19):
    table = Tables(Table_Number = i, Status = "Ready", Total_To_Pay= 0.00, Timer_Status = current_time)
    table.save()
