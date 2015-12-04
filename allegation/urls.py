from django.conf.urls import url

from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie

from allegation.views import AllegationAPIView, AreaAPIView
from allegation.views import AllegationGISApiView, AllegationClusterApiView
from allegation.views import AllegationChartApiView, InvestigationAPIView
from allegation.views import AllegationSummaryApiView, OfficerListAPIView
from allegation.views.allegation_analysis_api_view import AllegationAnalysisAPIView
from allegation.views.allegation_download_view import AllegationDownloadView
from allegation.views.allegation_race_gender_api import AllegationRaceGenderAPI
from allegation.views.allegation_sunburst_view import AllegationSunburstView
from allegation.views.session_view import SessionAPIView
from common.middleware.cache import orderless_cache_page

cache_view = orderless_cache_page(86400 * 90)


urlpatterns = [
    url(r'^api/allegations/$', cache_view(AllegationAPIView.as_view()), name='allegation-api'),
    url(r'^api/allegations/race-gender/$', cache_view(AllegationRaceGenderAPI.as_view()), name='allegation-race-gender-api'),
    url(r'^api/allegations/analysis$', AllegationAnalysisAPIView.as_view(), name='allegation-api-analysis'),
    url(r'^api/allegations/gis/$', cache_view(AllegationGISApiView.as_view()), name='allegation-api-gis'),
    url(r'^api/allegations/cluster/$', cache_view(AllegationClusterApiView.as_view()), name='allegation-api-clusters'),
    url(r'^api/allegations/summary/$', cache_view(AllegationSummaryApiView.as_view()), name='allegation-api-summary'),
    url(r'^api/allegations/chart/$', cache_view(AllegationChartApiView.as_view()), name='allegation-api-chart'),
    url(r'^api/allegations/officers/$', cache_view(OfficerListAPIView.as_view()), name='allegation-api-officers'),
    url(r'^api/areas/$', cache_view(AreaAPIView.as_view()), name='area-api'),
    url(r'^api/investigation/$', cache_view(InvestigationAPIView.as_view()), name='investigation'),
    url(r'^allegations/download/', (AllegationDownloadView.as_view()), name='allegation-download'),
    url(r'^api/allegations/sunburst/$', cache_view(AllegationSunburstView.as_view()), name='allegation-api-sunburst'),
    url(r'^api/allegations/session/$', csrf_exempt(ensure_csrf_cookie(SessionAPIView.as_view())), name='allegation-api-session'),
]
