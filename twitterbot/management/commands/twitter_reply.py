from bs4 import BeautifulSoup
import re

from django.conf import settings
from django.core.management.base import BaseCommand

from common.models import Officer, Investigator
import requests
from search.services.suggest.suggest_investigator import SuggestInvestigator
from search.services.suggest.suggest_officer import SuggestOfficerName
from twitterbot.models import TwitterSearch, Response, TwitterResponse


class Command(BaseCommand):
    help = 'Post Twitter replies'
    url_regex = 'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'

    @classmethod
    def create_responses(cls, try_officer_name):
        responses = []

        investigator_results = SuggestInvestigator.query(try_officer_name)
        if investigator_results['Investigator']:
            response = Response.objects.get(type='investigator')
            obj = Investigator.objects.get(pk=investigator_results['Investigator'][0]['tag_value']['value'])
            context = investigator_results['Investigator'][0]['tag_value']
            responses.append((response, obj, context))

        officer_results = SuggestOfficerName.query(try_officer_name)
        if officer_results['Officer']:
            response = Response.objects.get(type='officer')
            obj = Officer.objects.get(pk=officer_results['Officer'][0]['tag_value']['value'])
            context = officer_results['Officer'][0]['tag_value']
            responses.append((response, obj, context))

        return responses

    def handle_urls(self, urls, status, search):

        for url in urls:
            self.handle_url(url, status, search)

    def handle_url(self, url, status, search):
        try:
            response = requests.head(url)
            if 'twitter.com/' in response.headers['location']:
                return False

            response = requests.get(url)
        except:
            return False

        html = response.content.decode('utf-8')
        soup = BeautifulSoup(html)
        [s.extract() for s in soup(['style',
                                    'script',
                                    '[document]',
                                    'head',
                                    'title'])]
        visible_text = soup.getText()
        self.handle_text(visible_text, status, search)

    def handle_text(self, text, status, search):
        text = re.sub('(\t|\n|\r|\s)+', ' ', text)
        text = re.sub('[^A-Za-z0-9]+', ' ', text)
        splitted = text.split(" ")
        max_index = len(splitted)

        search.responded = {}

        responded = False
        for i in range(max_index - 1):
            try_officer_name = " ".join(splitted[i:i+2])

            if try_officer_name and try_officer_name != ' ' and len(try_officer_name) > 6:
                responses = Command.create_responses(try_officer_name)

                for response, obj, context in responses:
                    compare_str = "%s" % obj
                    if compare_str == try_officer_name and try_officer_name not in search.responded:
                        context['user'] = status['user']['screen_name']
                        context['obj'] = obj
                        search.responded[try_officer_name] = True
                        msg = response.get_message(context)

                        print("creating response search - ", try_officer_name, ": ", obj)

                        tweet = TwitterResponse.objects.create(search=search, response=msg, user=context['user'])
                        tweet.send()
                        responded = True

        return responded

    def handle_status(self, status, search, orig_status=False):

        if not orig_status:
            orig_status = status

        responded = self.handle_text(status['text'], status, search)

        urls = re.findall(self.url_regex, status['text'])
        if urls:
            self.handle_urls(urls, status, search)

        return responded

    def handle(self, *args, **options):
        for search in TwitterSearch.objects.all():
            data = search.search()

            statuses = data.get('statuses', [])
            for status in statuses:
                if 'quoted_status' in status and 'text' in status['quoted_status']:
                    responded = self.handle_status(status['quoted_status'], search, status)

                responded = self.handle_status(status, search) or responded

                if responded:
                    print('No result for %s from %s' % (status['text'], status['user']['screen_name']))

            if 'search_metadata' in data:
                search.refresh_url = data['search_metadata']['refresh_url']
                if not settings.DEBUG:
                    search.save()
