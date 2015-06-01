from django.conf.urls import url
from django.views.decorators.cache import cache_page

from officer.views.count_view import CountView


cache_one_hour = cache_page(3600)


urlpatterns = [
    url(r'^count/$', CountView.as_view(), name='count'),
]
