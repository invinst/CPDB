from django.http import HttpResponse
from django.views.generic.base import TemplateView


class AdminAnalysisDashboardView(TemplateView):
    template_name = "admin/analytics.html"
    def get(self, request):
        context = {}
        return self.render_to_response(context)
