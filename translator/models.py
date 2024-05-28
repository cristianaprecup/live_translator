
from django.db import models

class Translation(models.Model):
    original_text = models.TextField()
    translated_text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.original_text} -> {self.translated_text}"
