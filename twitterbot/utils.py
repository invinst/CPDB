import re
import os
import requests
import tweepy
from bs4 import BeautifulSoup
from django.conf import settings

from common.models import Investigator, Officer
from search.services.suggest.suggest_investigator import SuggestInvestigator
from search.services.suggest.suggest_officer import SuggestOfficerName
from twitterbot.models import Response, TwitterSearch, TwitterResponse

ERR_DUPLICATED_RESPONSE = 187
IGNORED_ERROR_CODES = [
    ERR_DUPLICATED_RESPONSE,
]
REPLY_LIMIT = 10


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
    debug = False
    screen_names = []

    def __init__(self, *args, **kwargs):
        super(CPDBTweetHandler, self).__init__(*args, **kwargs)

        if os.environ.get('TWITTER_DEBUG', None) == 'true':
            self.debug = True

        self.tweet_utils = TweetUtils()

    def on_status(self, status):
        self.screen_names = []
        if status.user.screen_name.lower() == settings.TWITTER_SCREEN_NAME.lower():
            return

        self.handle(status)
        if hasattr(status, 'retweeted_status') and status.retweeted_status:
            self.handle(status.retweeted_status)

        elif hasattr(status, 'quoted_status') and status.quoted_status:
            status.quoted_status['user'] = type('X', (object, ), status.quoted_status['user'])
            self.handle(type('Status', (object, ), status.quoted_status))

    def handle(self, status):

        self.screen_names.append(status.user.screen_name)
        if self.debug:
            print(status.text)
        try:
            self.reply(status)
        except tweepy.TweepError as e:
            # Errors that should not stop the bot
            if e.api_code in IGNORED_ERROR_CODES:
                pass

    def reply(self, status):
        responses = []

        text = self.tweet_utils.get_all_content(status)
        text = self.tweet_utils.sanitize_text(text)
        names = self.tweet_utils.find_names(text) + self.tweet_utils.find_names(text, word_length=3)

        responses += self.tweet_utils.build_officer_responses(names)
        responses += self.tweet_utils.build_investigator_responses(names)

        if self.debug:
            print("Responses: ", len(responses))

        for response in responses[:REPLY_LIMIT-1]:
            # For logging purpose
            for screen_name in self.screen_names:
                query = '@{user}'.format(user=screen_name)
                search, created = TwitterSearch.objects.get_or_create(query=query)
                TwitterResponse(search=search, response=response, user=status.user.screen_name).save()

                user_response = response.replace('{user}', screen_name)
                if self.debug:
                    print(user_response)
                try:
                    self.api.update_status(user_response)
                except:
                    pass


class TweetUtils:
    def get_all_content(self, status):
        texts = []

        texts.append(status.text)
        texts += self.parse_linked_websites(status.entities['urls'])
        texts += self.parse_hashtags(status)

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

    def parse_hashtags(self, status):
        hashtags = status.entities.get('hashtags', [])
        words = []

        for hashtag in hashtags:
            words += re.findall('[A-Z][a-z]*', hashtag['text'])

        return words

    def sanitize_text(self, text):
        text = re.sub('(\t|\n|\r|\s)+', ' ', text)
        text = re.sub('[^A-Za-z0-9]+', ' ', text)
        text = text.strip()

        return text

    def find_names(self, text, word_length=2):
        splitted = text.split(" ")
        max_index = len(splitted)
        names = []

        for i in range(max_index - (word_length - 1)):
            name = " ".join(splitted[i:i+word_length])
            if name and name != ' ' and len(name) > 6:
                names.append(name)

        return names

    def build_officer_responses(self, names):
        responses = []
        pks = []

        for name in names:
            search_results = SuggestOfficerName.query(name)
            if search_results['Officer']:
                pk = search_results['Officer'][0]['tag_value']['value']
                officer = Officer.objects.get(pk=pk)
                if pk not in pks and officer.display_name.lower() == name.lower():
                    response = Response.objects.filter(response_type='officer').first()
                    if response:
                        context = search_results['Officer'][0]['tag_value']
                        context['obj'] = officer
                        msg = response.get_message(context)

                        responses.append(msg)
                        pks.append(pk)

        return responses

    def build_investigator_responses(self, names):
        responses = []
        pks = []

        for name in names:
            search_results = SuggestInvestigator.query(name)
            if search_results['Investigator']:
                pk = search_results['Investigator'][0]['tag_value']['value']
                investigator = Investigator.objects.get(pk=pk)
                if pk not in pks and investigator.name.lower() == name.lower():
                    response = Response.objects.filter(response_type='investigator').first()
                    if response:
                        context = search_results['Investigator'][0]['tag_value']
                        context['obj'] = investigator
                        msg = response.get_message(context)

                        responses.append(msg)
                        pks.append(pk)

        return responses
