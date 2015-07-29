from django.conf.urls import url
from document.views.request_view import RequestView

urlpatterns = [
    url(r'^request/$', RequestView.as_view(), name='request'),
]
