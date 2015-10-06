from django.conf.urls import url, include
from rest_framework import routers

from api.views.officer_view import OfficerViewSet
from api.views.session_view import SessionViewSet


router = routers.DefaultRouter()
router.register(r'officers', OfficerViewSet)
router.register(r'sessions', SessionViewSet)


urlpatterns = [
    url(r'^', include(router.urls)),
]
