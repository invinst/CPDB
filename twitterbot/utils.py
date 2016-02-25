import re

import requests
import tweepy
from bs4 import BeautifulSoup
from django.conf import settings

from common.models import Investigator, Officer
from search.services.suggest.suggest_investigator import SuggestInvestigator
from search.services.suggest.suggest_officer import SuggestOfficerName
from twitterbot.models import Response, TwitterSearch, TwitterResponse


class TwitterBot:
    def __init__(self):
        self.api = None

    def start(self):
        self.auth()

        tweet_handler = CPDBTweetHandler(self.api)
        self.listen_to_tweets(tweet_handler)

    def auth(self):
        auth = tweepy.OAuthHandler(settings.TWITTER_CONSUMER_KEY, settings.TWITTER_CONSUMER_SECRET)
        auth.set_access_token(settings.TWITTER_APP_TOKEN_KEY, settings.TWITTER_APP_TOKEN_SECRET)
        self.api = tweepy.API(auth)

        self.api.verify_credentials()

    def listen_to_tweets(self, handler):
        stream = tweepy.Stream(auth=self.api.auth, listener=handler)
        stream.userstream()


class CPDBTweetHandler(tweepy.StreamListener):
    def on_status(self, status):
        try:
            self.reply(status)
            if hasattr(status, 'retweeted_status'):
                self.reply(status.retweeted_status)
        except tweepy.TweepError as e:
            # Errors that should not stop the bot
            # 187: Duplicated status
            if int(e.api_code) in [187]:
                pass

    def reply(self, status):
        responses = []

        text = self.get_all_content(status)
        text = self.sanitize_text(text)
        names = self.find_names(text)

        responses += self.build_officer_reponses(names)
        responses += self.build_investigator_reponses(names)

        for response in responses:
            # For logging purpose
            query = '@{user}'.format(user=status.entities['user_mentions'][0]['screen_name'])
            search, created = TwitterSearch.objects.get_or_create(query=query)
            TwitterResponse(search=search, response=response, user=status.user.screen_name).save()

            response = '@{user} {msg}'.format(user=status.user.screen_name, msg=response)
            self.api.update_status(response)

    def get_all_content(self, status):
        texts = []

        texts.append(status.text)
        texts += self.parse_linked_websites(status.entities['urls'])

        return ' '.join(texts)

    def parse_linked_websites(self, urls):
        texts = []

        for url in urls:
            response = requests.get(url['expanded_url'])
            html = response.content.decode('utf-8')
            soup = BeautifulSoup(html)
            [s.extract() for s in soup([
                'style',
                'script',
                '[document]',
                'head',
                'title'
            ])]

            texts.append(soup.getText())

        return texts

    def sanitize_text(self, text):
        text = re.sub('(\t|\n|\r|\s)+', ' ', text)
        text = re.sub('[^A-Za-z0-9]+', ' ', text)

        return text

    def find_names(self, text):
        splitted = text.split(" ")
        max_index = len(splitted)
        names = []

        for i in range(max_index - 1):
            name = " ".join(splitted[i:i+2])
            if name and name != ' ' and len(name) > 6:
                names.append(name)

        return set(names)

    def build_officer_reponses(self, names):
        responses = []

        for name in names:
            search_results = SuggestOfficerName.query(name)
            if search_results['Officer']:
                response = Response.objects.get(type='officer')
                context = search_results['Officer'][0]['tag_value']
                context['obj'] = Officer.objects.get(pk=search_results['Officer'][0]['tag_value']['value'])
                msg = response.get_message(context)

                responses.append(msg)

        return responses

    def build_investigator_reponses(self, names):
        responses = []

        for name in names:
            search_results = SuggestInvestigator.query(name)
            if search_results['Investigator']:
                response = Response.objects.get(type='investigator')
                context = search_results['Investigator'][0]['tag_value']
                context['obj'] = Investigator.objects.get(pk=search_results['Investigator'][0]['tag_value']['value'])
                msg = response.get_message(context)

                responses.append(msg)

        return responses
