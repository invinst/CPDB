from django.shortcuts import get_object_or_404
from django.views.generic.base import View

from allegation.models import Download
from allegation.services.download_allegations import download_allegations
from document.response import JsonResponse


class AllegationDownloadView(View):
    def get(self, request):
        download = get_object_or_404(Download, pk=request.GET.get('id'))
        return JsonResponse({
            'download': download
        })

    def post(self, request):
        query_string = request.META['QUERY_STRING']
        download = Download.objects.create(query=query_string)
        download_allegations.delay(download.id)

        return JsonResponse({
            'download': download
        })
