from django.db import models


class Download(models.Model):
    query = models.TextField()
    finished = models.BooleanField(default=False)
    url = models.TextField()
