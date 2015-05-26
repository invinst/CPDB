from django.conf.urls import url
from allegation.views import AllegationAPIView, AllegationGISApiView, AreaAPIView, FilterAPIView, AllegationListView

urlpatterns = [
    url(r'^api/allegations/$', AllegationAPIView.as_view(), name='allegation-api'),
    url(r'^api/allegations/gis/$', AllegationGISApiView.as_view(), name='allegation-api-gis'),
    url(r'^api/areas/$', AreaAPIView.as_view(), name='area-api'),
    url(r'^api/filters/$', FilterAPIView.as_view(), name='filter-api'),
    url(r'^allegations/$', AllegationListView.as_view(template_name='allegation/allegation_list.html'),
        name='allegations'),
]
