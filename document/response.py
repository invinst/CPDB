from django.http.response import HttpResponseBadRequest as BaseHttpResponseBadRequest, HttpResponse

from common.json_serializer import JSONSerializer


class HttpResponseBadRequest(BaseHttpResponseBadRequest):
    def __init__(self, form=None, content='', *args, **kwargs):
        if form:
            content = {
                'errors': form.errors
            }
            content = JSONSerializer().serialize(content)
        super(HttpResponseBadRequest, self).__init__(content, content_type="application/json", *args, **kwargs)


class JsonResponse(HttpResponse):
    def __init__(self, data=None, safe=True, **kwargs):
        data = data or {}
        if safe and not isinstance(data, dict):
            raise TypeError('In order to allow non-dict objects to be '
                            'serialized set the safe parameter to False')
        kwargs.setdefault('content_type', 'application/json')
        data = JSONSerializer().serialize(data)
        super(JsonResponse, self).__init__(content=data, **kwargs)
