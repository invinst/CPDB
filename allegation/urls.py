from django.conf.urls import include, url
from allegation.views import AllegationAPIView, AllegationGISApiView, AreaAPIView, FilterAPIView, AllegationListView
from django.views.decorators.cache import cache_page
cache_one_hour = cache_page(3600)

urlpatterns = [
    url(r'^api/allegations/$', cache_one_hour(AllegationAPIView.as_view()), name='allegation-api'),
    url(r'^api/allegations/gis/$', cache_one_hour(AllegationGISApiView.as_view()), name='allegation-api-gis'),
    url(r'^api/areas/$', cache_one_hour(AreaAPIView.as_view()), name='area-api'),
    url(r'^api/filters/$', FilterAPIView.as_view(), name='filter-api'),
    url(r'^allegations/$', AllegationListView.as_view(template_name='allegation/allegation_list.html'), name='allegations'),
]
