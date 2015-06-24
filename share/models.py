from django.conf import settings
from django.core.urlresolvers import reverse
from django.db import models
from django_extensions.db.fields.json import JSONField
from hashids import Hashids


hash_obj = Hashids(settings.SECRET_KEY, min_length=6)


class Session(models.Model):
    title = models.CharField(max_length=255)
    query = JSONField()
    share_from = models.ForeignKey('share.Session', null=True, default=None)
    share_count = models.IntegerField(default=0)

    @property
    def hash_id(self):
        return hash_obj.encode(self.id)

    @staticmethod
    def id_from_hash(hash_id):
        return hash_obj.decode(hash_id)

    def get_absolute_url(self):
        return reverse('homepage-share', kwargs={'hash_id': self.hash_id})

    def clone(self):
        session = Session()
        session.save()
        return session
