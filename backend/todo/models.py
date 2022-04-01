from django.db import models

# Create your models here.
class Todo(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField(null=True, blank=True)
    completed = models.BooleanField(default=False)

    def _str_(self):
        return self.title
        # The __str__ method tells Django what to print when it needs to print out an instance of the any model
