from django.contrib.sessions.middleware import SessionMiddleware
from django.conf import settings

class TokenSessionMiddleware(SessionMiddleware):
    def process_request(self, request):
         session_key = request.META.get("HTTP_%s" % settings.SESSION_KEY_NAME, None)
         request.session = self.SessionStore(session_key)
