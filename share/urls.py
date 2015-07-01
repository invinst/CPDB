from django.conf.urls import url

from share.views.init_view import InitView

urlpatterns = [
    url(r'^init/$', InitView.as_view(), name='init'),
]
