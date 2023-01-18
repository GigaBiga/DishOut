from django.db import models

class Menu(models.Model):
    DishID = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=100)
    Price = models.FloatField(max_length=100)
    Num_Ordered = models.IntegerField()
    Category = models.CharField(max_length=50)

class Tables(models.Model):
    Table_Number = models.AutoField(primary_key=True)
    Status = models.CharField(max_length=50)
    Total_To_Pay = models.FloatField()
    Timer_Status = models.TimeField()

class Orders(models.Model):
    OrderID = models.AutoField(primary_key=True)
    Table_Number = models.ForeignKey(Tables, on_delete=models.DO_NOTHING)
    DishID = models.ForeignKey(Menu, on_delete=models.CASCADE)
    Status = models.CharField(max_length=50)
    Note = models.CharField(max_length=280)

class Employees(models.Model):
    Username = models.CharField(max_length=25,primary_key=True)
    Password = models.CharField(max_length=500, null=True)
    Role = models.CharField(max_length=20)
    Orders_delivered = models.IntegerField()

class Delivery(models.Model):
    OrderID = models.ForeignKey(Orders, on_delete=models.CASCADE)
    Username = models.ForeignKey(Employees, on_delete=models.CASCADE)

