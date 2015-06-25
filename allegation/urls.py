from django.conf.urls import url
from django.views.decorators.cache import cache_page

from allegation.views import AllegationAPIView, AllegationGISApiView, AreaAPIView, InvestigationAPIView, \
    AllegationChartApiView
from allegation.views import AllegationSummaryApiView, AllegationListView, OfficerListAPIView


cache_view = cache_page(86400 * 90)


urlpatterns = [
    url(r'^api/allegations/$', cache_view(AllegationAPIView.as_view()), name='allegation-api'),
    url(r'^api/allegations/gis/$', cache_view(AllegationGISApiView.as_view()), name='allegation-api-gis'),
    url(r'^api/allegations/summary/$', cache_view(AllegationSummaryApiView.as_view()), name='allegation-api-summary'),
    url(r'^api/allegations/chart/$', cache_view(AllegationChartApiView.as_view()), name='allegation-api-chart'),
    url(r'^api/allegations/officers/$', cache_view(OfficerListAPIView.as_view()), name='allegation-api-summary'),
    url(r'^api/areas/$', cache_view(AreaAPIView.as_view()), name='area-api'),
    url(r'^api/investigation/$', InvestigationAPIView.as_view()),
    url(r'^allegations/$', AllegationListView.as_view(template_name='allegation/allegation_list.html'),
        name='allegations'),
]
