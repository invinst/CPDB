from django.conf.urls import url, include
from rest_framework import routers

from api.views.officer_view import OfficerViewSet


router = routers.DefaultRouter()
router.register(r'officers', OfficerViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]
