from django.conf.urls import url

from mobile.views.mobile_officer_allegation_view import MobileOfficerAllegationView
from mobile.views.mobile_officer_view import MobileOfficerView
from mobile.views.mobile_related_officers_view import MobileRelatedOfficersView
from mobile.views.mobile_site_view import MobileSiteView
from mobile.views.mobile_suggestion_view import MobileSuggestionView


urlpatterns = [
    url(r'^$', MobileSiteView.as_view(), name='home'),
    url(r'^api/suggestion/$', MobileSuggestionView.as_view(), name='suggestion'),
    url(r'^api/officer/$', MobileOfficerView.as_view(), name='officer'),
    url(r'^api/officer/allegation/$', MobileOfficerAllegationView.as_view(), name='officer-allegation'),
    url(r'^api/officer/related_officer/$', MobileRelatedOfficersView.as_view(), name='officer-related_officer'),
]
