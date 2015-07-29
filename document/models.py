from django.db import models


class RequestEmail(models.Model):
    crid = models.CharField(max_length=20)
    email = models.EmailField()
    session = models.ForeignKey('share.Session')

    class Meta:
        unique_together = (('crid', 'email'),)
