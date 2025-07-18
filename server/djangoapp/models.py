# Uncomment the following imports before adding the Model code

from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


# Create your models here.

class CarMake(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


class CarModel(models.Model):
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    CAR_TYPES = [
        ('sedan', 'SEDAN'),
        ('suv', 'SUV'),
        ('wagon', 'WAGON'),
        ('truck', 'TRUCK'),
    ]
    car_type = models.CharField(
        max_length=10, choices=CAR_TYPES, default='sedan'
    )
    year = models.IntegerField(
        default=2023,
        validators=[
            MaxValueValidator(2023),
            MinValueValidator(2015)
        ]
    )


def __str__(self):
    return self.name
