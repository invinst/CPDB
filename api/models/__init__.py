from django.db import models


class Setting(models.Model):
    key = models.CharField(max_length=255, db_index=True, unique=True, blank=False)
    value = models.CharField(max_length=255)
