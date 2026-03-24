from django.db import models
from django.utils.text import slugify

class Brand(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name) 
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Size(models.Model):
    size = models.IntegerField()
    slug = models.SlugField(unique=True, blank=True)  

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.size) 
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.size)


class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    image = models.URLField(max_length=1000)
    stock = models.IntegerField()
    sizes = models.ManyToManyField(Size, related_name="products")

    def __str__(self):
        return self.name