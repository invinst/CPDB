from django.views.generic import TemplateView


class MobileSiteView(TemplateView):
    template_name = 'mobile/index.html'

    def get_context_data(self, **kwargs):
        context = super(MobileSiteView, self).get_context_data(**kwargs)
        return context

    def get(self, request, hash_id=None, *args, **kwargs):
        return super(MobileSiteView, self).get(request, *args, **kwargs)
