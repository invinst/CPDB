BotNames = [
    'Googlebot', 'Slurp', 'Twiceler', 'msnbot', 'KaloogaBot', 'YodaoBot', '"Baiduspider', 'googlebot', 'Speedy Spider',
    'DotBot']
param_name = 'deny_crawlers'


class CrawlerDetector(object):
    def process_request(self, request):
        user_agent = request.META.get('HTTP_USER_AGENT', [])

        request.is_crawler = False

        for botname in BotNames:
            if botname in user_agent:
                request.is_crawler = True
