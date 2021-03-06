from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie

from allegation.views import AreaAPIView
from allegation.views import (
    OfficerAllegationGISApiView, OfficerAllegationClusterApiView)
from allegation.views import PoliceWitnessAPIView
from allegation.views import (
    OfficerAllegationSummaryApiView, OfficerListAPIView)
from allegation.views.allegation_search_view import AllegationSearchView
from allegation.views.allegation_view import AllegationView
from allegation.views.officer_allegation_analysis_api_view import (
    OfficerAllegationAnalysisAPIView)
from allegation.views.allegation_download_view import AllegationDownloadView
from allegation.views.officer_allegation_race_gender_api import (
    OfficerAllegationRaceGenderAPI)
from allegation.views.officer_allegation_sunburst_view import (
    OfficerAllegationSunburstView)
from allegation.views.session_view import SessionAPIView
from allegation.views.officer_allegation_api_view import (
    OfficerAllegationAPIView)
from allegation.views.sunburst_view import SunburstView
from allegation.views.sunburst_image_view import SunburstImageView
from common.middleware.cache import orderless_cache_page

cache_view = orderless_cache_page(86400 * 90)

urlpatterns = [
    url(r'^api/officer-allegations/$',
        cache_view(OfficerAllegationAPIView.as_view()),
        name='officer-allegation-api'),
    url(r'^api/officer-allegations/race-gender/$',
        cache_view(OfficerAllegationRaceGenderAPI.as_view()),
        name='officer-allegation-race-gender-api'),
    url(r'^api/officer-allegations/analysis$',
        OfficerAllegationAnalysisAPIView.as_view(),
        name='officer-allegation-api-analysis'),
    url(r'^api/officer-allegations/gis/$',
        cache_view(OfficerAllegationGISApiView.as_view()),
        name='officer-allegation-api-gis'),
    url(r'^api/officer-allegations/cluster/$',
        cache_view(OfficerAllegationClusterApiView.as_view()),
        name='officer-allegation-api-clusters'),
    url(r'^api/officer-allegations/summary/$',
        cache_view(OfficerAllegationSummaryApiView.as_view()),
        name='officer-allegation-api-summary'),
    url(r'^api/officer-allegations/officers/$',
        cache_view(OfficerListAPIView.as_view()),
        name='officer-allegation-api-officers'),
    url(r'^api/officer-allegations/sunburst/$',
        cache_view(OfficerAllegationSunburstView.as_view()),
        name='officer-allegation-api-sunburst'),

    url(r'^api/areas/$', cache_view(AreaAPIView.as_view()), name='area-api'),
    url(r'^api/police-witness/$',
        cache_view(PoliceWitnessAPIView.as_view()), name='police-witness'),

    url(r'^allegations/download/',
        (AllegationDownloadView.as_view()), name='allegation-download'),
    url(r'^api/allegations/session/$',
        csrf_exempt(ensure_csrf_cookie(SessionAPIView.as_view())),
        name='allegation-api-session'),
    url(r'^q/(?P<term>\w+)/$', cache_view(AllegationSearchView.as_view()), name='search-q-page'),
    url(r'^s/(?P<term>\w+)/$', cache_view(AllegationSearchView.as_view()), name='search-s-page'),

    url(r'^complaint/(?P<crid>\d+)/(?P<category_slug>.*)/(?P<cat_hash>\w{8})$', cache_view(AllegationView.as_view()),
        name='complaint-page'),

    url(r'^sunburst-image/(?P<hash_id>\w{6})/$', cache_view(SunburstImageView.as_view()), name='sunburst-image'),
    url(r'^sunburst/(?P<hash_id>\w{6})/$', cache_view(SunburstView.as_view()), name='sunburst')
]
