from django.conf.urls import url, include
from django.views.decorators.csrf import ensure_csrf_cookie

from mobile.views.mobile_allegation_view import \
    MobileAllegationView
from mobile.views.mobile_data_tool_view import MobileDataToolView
from mobile.views.mobile_officer_view import MobileOfficerView
from mobile.views.mobile_site_view import MobileSiteView
from mobile.views.mobile_suggestion_view import MobileSuggestionView

urlpatterns = [
    url(r'^$', MobileSiteView.as_view(), name='home'),
    url(r'^lookup/', include('common.urls', namespace='common')),

    # api urls
    url(r'^api/suggestion/$', MobileSuggestionView.as_view(), name='suggestion'),
    url(r'^api/allegation/$', MobileAllegationView.as_view(), name='allegation'),
    url(r'^api/officer/$', MobileOfficerView.as_view(), name='officer'),

    # fall-back urls
    url(r'^mobile/api/suggestion/$', MobileSuggestionView.as_view(), name='mobile-suggestion'),
    url(r'^mobile/api/allegation/$', MobileAllegationView.as_view(), name='mobile-allegation'),
    url(r'^mobile/api/officer/$', MobileOfficerView.as_view(), name='mobile-officer'),

    # overriding for client-side routing
    url(r'^(officer/[^/]+/\d+|complaint/\d+|search/.*)?$', ensure_csrf_cookie(MobileSiteView.as_view()), name='home'),
    url(r'^mobile/(officer/[^/]+/\d+|complaint/\d+|search/.*)?$', ensure_csrf_cookie(MobileSiteView.as_view()),
        name='home'),

    # for interpret from desktop version
    url(r'^data/(?P<hash_id>\w+)/(?P<slug>.*)$', MobileDataToolView.as_view(), name='data-tool'),
    url(r'^mobile/data/(?P<hash_id>\w+)/(?P<slug>.*)$', MobileDataToolView.as_view(), name='mobile-data-tool')
]
