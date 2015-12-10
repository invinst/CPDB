from django.conf.urls import url

from common.views.lookup_view import LookupView

urlpatterns = [
    url(r'^(?P<query>.*)$', LookupView.as_view(), name='lookup')
]
