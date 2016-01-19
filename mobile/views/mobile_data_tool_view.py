from django.views.generic import RedirectView

from mobile.services.mobile_data_tool_service import MobileDataToolService


class MobileDataToolView(RedirectView):

    def get_redirect_url(self, *args, **kwargs):
        hash_id = kwargs.get('hash_id', '')
        data_tool_service = MobileDataToolService(hash_id=hash_id)

        return data_tool_service.redirect_url()
