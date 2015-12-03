from django.conf import settings
from hashids import Hashids

hash_obj = Hashids(settings.SECRET_KEY, min_length=6)
