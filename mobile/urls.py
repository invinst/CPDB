from django.conf.urls import url, include
from django.views.decorators.csrf import ensure_csrf_cookie

from mobile.views.mobile_allegation_view import MobileAllegationView
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
    url(r'^mobile/api/suggestion/$', MobileSuggestionView.as_view(), name='suggestion'),
    url(r'^mobile/api/allegation/$', MobileAllegationView.as_view(), name='allegation'),
    url(r'^mobile/api/officer/$', MobileOfficerView.as_view(), name='officer'),

    # overriding for client-side routing
    url(r'^(officer/[^/]+/\d+|complaint/\d+|search/\w+)?$', ensure_csrf_cookie(MobileSiteView.as_view()), name='home'),
    url(r'^(test)?$', ensure_csrf_cookie(MobileSiteView.as_view()), name='home'),

    # other cases, render MobileSiteView instead of the 404 page, handle the error from javascript
    url(r'', MobileSiteView.as_view(), name='not_found')
]
