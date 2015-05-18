from django.conf.urls import url
from allegation.views import AllegationAPIView

urlpatterns = [
    url(r'^api/allegations/', AllegationAPIView.as_view(), name='allegation-api'),
]
