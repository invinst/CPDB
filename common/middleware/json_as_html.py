from django.conf import settings


class JsonAsHTML(object):
    def process_response(self, request, response):
        if not settings.DEBUG:
            return response

        if request.is_ajax():
            return response

        if "application/json" in response['Content-Type'].lower():
            title = "JSON as HTML Middleware for: %s" % request.get_full_path()
            response.content = "<html><head><title>%s</title></head><body>%s</body></html>" % (title, response.content)
            response['Content-Type'] = 'text/html'
        return response
