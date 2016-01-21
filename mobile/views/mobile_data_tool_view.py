from django.views.generic import RedirectView

from mobile.constants import DEFAULT_REDIRECT_URL
from mobile.services.mobile_data_tool_service import DesktopToMobileRedirectorService
from share.models import Session


class MobileDataToolView(RedirectView):

    def get_redirect_url(self, *args, **kwargs):
        hash_id = kwargs.get('hash_id', '')

        try:
            session_id = Session.id_from_hash(hash_id)[0]
            session = Session.objects.get(id=session_id)
            self.filters = session.query.get('filters', {})
        except (IndexError, Session.DoesNotExist):
            self.filters = {}

        redirect_urls = DesktopToMobileRedirectorService().perform(self.filters)

        if len(redirect_urls) == 1:
            return redirect_urls[0]

        return DEFAULT_REDIRECT_URL
