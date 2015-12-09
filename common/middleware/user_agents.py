BotNames=['Googlebot','Slurp','Twiceler','msnbot','KaloogaBot','YodaoBot','"Baiduspider','googlebot','Speedy Spider','DotBot']
param_name='deny_crawlers'

class CrawlerBlocker(object):
    def process_request(self, request):
        user_agent=request.META.get('HTTP_USER_AGENT',None)

        request.is_crawler=False

        for botname in BotNames:
            if botname in user_agent:
                request.is_crawler=True
