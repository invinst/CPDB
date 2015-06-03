from django.http.response import HttpResponseBadRequest
from django.shortcuts import render


def detail_view(request):
    # if 'id' not in request.GET:
    #     return HttpResponseBadRequest()
    # if 'title' not in request.GET:
    #     return HttpResponseBadRequest()
    # doc_id = request.GET.get('id')
    # title = request.GET.get('title')
    doc_id = '2092482'
    title = '000_nanana'

    return render(request, 'document/view.html', context={
        'id': doc_id,
        'title': title,
    })
