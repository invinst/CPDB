from django.conf.urls import url
import document.views

urlpatterns = [
    url(r'^view/$', document.views.detail_view, name='view'),
]
