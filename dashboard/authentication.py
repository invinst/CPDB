from rest_framework import authentication


class SessionAuthentication(authentication.SessionAuthentication):
    def enforce_csrf(self, request):
        return
