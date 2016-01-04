from django.conf.urls import url, include
from django.views.decorators.csrf import ensure_csrf_cookie

from mobile.views.mobile_officer_allegation_view import \
    MobileOfficerAllegationView
from mobile.views.mobile_officer_view import MobileOfficerView
from mobile.views.mobile_site_view import MobileSiteView
from mobile.views.mobile_suggestion_view import MobileSuggestionView

urlpatterns = [
    url(r'^$', MobileSiteView.as_view(), name='home'),
    url(r'^lookup/', include('common.urls', namespace='common')),
    url(r'^api/suggestion/$', MobileSuggestionView.as_view(),
        name='suggestion'),
    url(r'^api/officer-allegation/$', MobileOfficerAllegationView.as_view(),
        name='officer-allegation'),
    url(r'^mobile/api/officer-allegation/$',
        MobileOfficerAllegationView.as_view(), name='officer-allegation'),
    url(r'^api/officer/$', MobileOfficerView.as_view(), name='officer'),
    url(r'^mobile/api/officer/$', MobileOfficerView.as_view(), name='officer'),
    url(r'^(officer/[^/]+/\d+|complaint/\d+|search/\w+)?$',
        ensure_csrf_cookie(MobileSiteView.as_view()), name='home'),
    url(r'^(test)?$', ensure_csrf_cookie(MobileSiteView.as_view()),
        name='home'),
]
