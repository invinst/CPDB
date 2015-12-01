from datetime import datetime

from django.views.generic.base import View
from django.http import HttpResponse

from dashboard.admin import AllegationResource
from common.models import Allegation

class AdminInvestigationDocumentsExportView(View):

    def get(self, request):
        export = AllegationResource().export(queryset=Allegation.objects.distinct('crid'))
        response = HttpResponse(export.xls, content_type='application/xls', status=200)

        response['Content-Disposition'] = 'attachment; filename="investigation_document_{today}.xls"'.format(
          today=datetime.now().strftime('%Y-%m-%d'))
        return response
