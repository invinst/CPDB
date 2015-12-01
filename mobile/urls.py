from django.conf.urls import url

from mobile.views.mobile_related_officers_view import MobileRelatedOfficersView
from mobile.views.mobile_site_view import MobileSiteView
from mobile.views.mobile_suggestion_view import MobileSuggestionView


urlpatterns = [
    url(r'^$', MobileSiteView.as_view(), name='home'),
    url(r'^api/suggestion/$', MobileSuggestionView.as_view(), name='suggestion'),
    url(r'^api/related_officer/$', MobileRelatedOfficersView.as_view(), name='related_officer'),
]
