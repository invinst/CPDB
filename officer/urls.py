from django.conf.urls import url
from officer.views.count_view import CountView

urlpatterns = [
    url(r'^count/$', CountView.as_view(), name='count'),
]
