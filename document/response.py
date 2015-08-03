from django.http.response import HttpResponseBadRequest as BaseHttpResponseBadRequest

from common.json_serializer import JSONSerializer


class HttpResponseBadRequest(BaseHttpResponseBadRequest):
    def __init__(self, form=None, content='', *args, **kwargs):
        if form:
            content = JSONSerializer().serialize(form.errors)
        super(HttpResponseBadRequest, self).__init__(content, *args, **kwargs)
