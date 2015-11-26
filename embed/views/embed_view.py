import json

from django.views.generic.base import TemplateView


class EmbedView(TemplateView):
    template_name = 'embed/embed.html'

    def get_context_data(self, **kwargs):
        context = super(EmbedView, self).get_context_data(**kwargs)
        context['page'] = self.request.GET.get('page')
        context['pk'] = self.request.GET.get('pk')
        context['query'] = self.request.GET.get('query')
        state = self.request.GET.get('state')
        if state:
            state = json.loads(state)
            context['state'] = state
        return context
