from common.models import DocumentCrawler
from document.response import JsonResponse


def crawl_stats(request):

    docs = DocumentCrawler.objects.all().values('timestamp', 'num_documents').order_by('-timestamp')
    return JsonResponse({
        'status': 200,
        'docs': docs
    })
