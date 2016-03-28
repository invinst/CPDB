from django.test.client import RequestFactory

from common.middleware.user_agent import CrawlerDetector
from common.tests.core import SimpleTestCase


class CrawlerDetectorTestCase(SimpleTestCase):
    def test_detect_crawler(self):
        request = RequestFactory()
        request.META = {'HTTP_USER_AGENT': 'Googlebot'}

        middleware = CrawlerDetector()
        middleware.process_request(request)

        request.is_crawler.should.be.true

    def test_detect_noncrawler(self):
        request = RequestFactory()
        request.META = {'HTTP_USER_AGENT': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36'
                                           ' (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'}

        middleware = CrawlerDetector()
        middleware.process_request(request)

        request.is_crawler.should.be.false
