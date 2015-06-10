from django.conf.urls import url
from django.views.decorators.cache import cache_page

from officer.views.count_view import CountView
from officer.views.officer_detail_view import OfficerDetailView


cache_one_hour = cache_page(3600)


urlpatterns = [
    url(r'^count/$', CountView.as_view(), name='count'),
    url(r'^view/$', OfficerDetailView.as_view(), name='detail'),
]
