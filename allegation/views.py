from django.views.generic.list import ListView
from common.models import Allegation


class AllegationListView(ListView):
    model = Allegation
    template_name = 'allegation_list.html'
