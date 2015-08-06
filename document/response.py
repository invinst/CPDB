from django.http.response import HttpResponseBadRequest as BaseHttpResponseBadRequest, HttpResponse

from common.json_serializer import JSONSerializer


class HttpResponseBadRequest(BaseHttpResponseBadRequest):
    def __init__(self, form=None, content='', *args, **kwargs):
        if form:
            content = JSONSerializer().serialize(form.errors)
        super(HttpResponseBadRequest, self).__init__(content, *args, **kwargs)


class JsonResponse(HttpResponse):
    def __init__(self, data, safe=True, **kwargs):
        if safe and not isinstance(data, dict):
            raise TypeError('In order to allow non-dict objects to be '
                            'serialized set the safe parameter to False')
        kwargs.setdefault('content_type', 'application/json')
        data = JSONSerializer().serialize(data)
        super(JsonResponse, self).__init__(content=data, **kwargs)
