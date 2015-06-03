from django.http.response import HttpResponseBadRequest
from django.shortcuts import render
from common.models import Allegation


def detail_view(request):
    if 'id' not in request.GET:
        return HttpResponseBadRequest()
    allegation_id = request.GET.get('id')

    allegation = Allegation.objects.get(id=allegation_id)

    return render(request, 'document/view.html', context={
        'id': allegation.document_id,
        'normalized_title': allegation.document_normalized_title,
        'title': allegation.document_title,
    })
