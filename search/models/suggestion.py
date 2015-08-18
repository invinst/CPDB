from django.db import models


class SuggestionLog(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    query = models.CharField(max_length=50)
    num_suggestions = models.PositiveIntegerField(default=0)
    session_id = models.CharField(max_length=100)


class FilterLog(models.Model):
    query = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    session_id = models.CharField(max_length=100)
    num_allegations = models.PositiveIntegerField()
