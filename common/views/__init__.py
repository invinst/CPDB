from django.http.response import HttpResponseRedirect


def handler404(request):
    return HttpResponseRedirect("/")
