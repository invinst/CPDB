from django.conf.urls import url
from django.views.decorators.cache import cache_page
from django.views.decorators.clickjacking import xframe_options_exempt

from embed.views.embed_view import EmbedView

cache_view = cache_page(86400 * 90)


urlpatterns = [
    url(r'^$', cache_view(xframe_options_exempt(EmbedView.as_view())), name='embed'),
]
