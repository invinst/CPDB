from django.conf.urls import include, url
from allegation.views import AllegationAPIView, AllegationAutocompleteJSONView

urlpatterns = [
    url(r'^allegations/autocomplete/', AllegationAutocompleteJSONView.as_view(), name='autocomplete_json'),
    url(r'^api/allegations/', AllegationAPIView.as_view(), name='allegation-api'),
]
