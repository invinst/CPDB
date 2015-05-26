from django.conf.urls import url
from search.views.suggest_view import SuggestView

urlpatterns = [
    url(r'^suggest/$', SuggestView.as_view(), name='suggest'),
]
