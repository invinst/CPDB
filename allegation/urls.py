from django.conf.urls import include, url
from allegation.views import AllegationAPIView, AreaAPIView, FilterAPIView, AllegationGISApiView

urlpatterns = [
    url(r'^api/allegations/$', AllegationAPIView.as_view(), name='allegation-api'),
    url(r'^api/allegations/gis/$', AllegationGISApiView.as_view(), name='allegation-api-gis'),
    url(r'^api/areas/$', AreaAPIView.as_view(), name='area-api'),
    url(r'^api/filters/$', FilterAPIView.as_view(), name='filter-api'),
]
