import copy
import re
import os
import requests
import tweepy
import logging
from bs4 import BeautifulSoup
from django.conf import settings

from common.models import Investigator, Officer
from search.services.suggest.suggest_investigator import SuggestInvestigator
from search.services.suggest.suggest_officer import SuggestOfficerName
from twitterbot.models import Response, TwitterSearch, TwitterResponse, TwitterBotError

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
        is_ok = self.handle_stream(stream)
        while not is_ok and settings.DJANGO_ENV != 'test':
            self.handle_stream(stream)

    def handle_stream(self, stream):
        try:
            stream.userstream()
            return True
        except Exception as e:
            TwitterBotError(stack_trace=repr(e)).save()
            return False


class CPDBTweetHandler(tweepy.StreamListener):
    debug = False
    screen_names = []

    def __init__(self, api, *args, **kwargs):
        super(CPDBTweetHandler, self).__init__(api=api, *args, **kwargs)

        if os.environ.get('TWITTER_DEBUG', None) == 'true':
            self.debug = True

        self.tweet_utils = TweetUtils(api)

    def on_status(self, status):
        if status.user.screen_name == settings.TWITTER_SCREEN_NAME:
            return

        self.screen_names = self.tweet_utils.get_screen_names_recursively(status)
        try:
            self.reply(status)
        except tweepy.TweepError as e:
            if e.api_code in IGNORED_ERROR_CODES:
                pass

    def reply(self, status):
        text = ' '.join(self.tweet_utils.get_all_content_recursively(status))
        text = self.tweet_utils.sanitize_text(text)
        names = self.tweet_utils.find_names(text) + self.tweet_utils.find_names(text, word_length=3)

        responses = self.tweet_utils.build_all_responses(names, status.id)

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
    def __init__(self, api):
        self.api = api

    def get_screen_names_recursively(self, status):
        screen_names = [status.user.screen_name]
        screen_names += [x['screen_name'] for x in status.entities['user_mentions']]

        if hasattr(status, 'retweeted_status') and status.retweeted_status:
            screen_names += self.get_screen_names_recursively(status.retweeted_status)

        if hasattr(status, 'quoted_status') and status.quoted_status:
            screen_names += self.get_screen_names_recursively(self.convert_quoted_status(status.quoted_status))

        if hasattr(status, 'quoted_status_id_str') and status.quoted_status_id_str:
            quoted_status = self.api.get_status(status.quoted_status_id_str)
            screen_names += self.get_screen_names_recursively(quoted_status)

        return [x for x in set(screen_names) if x != settings.TWITTER_SCREEN_NAME]

    def get_all_content_recursively(self, status):
        texts = []

        texts.append(status.text)
        texts += self.parse_linked_websites(status.entities['urls'])
        texts += self.parse_hashtags(status)

        if hasattr(status, 'retweeted_status') and status.retweeted_status:
            texts += self.get_all_content_recursively(status.retweeted_status)

        if hasattr(status, 'quoted_status') and status.quoted_status:
            texts += self.get_all_content_recursively(self.convert_quoted_status(status.quoted_status))

        if hasattr(status, 'quoted_status_id_str') and status.quoted_status_id_str:
            quoted_status = self.api.get_status(status.quoted_status_id_str)
            texts += self.get_all_content_recursively(quoted_status)

        return texts

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

        if len(texts) > 0 and ('CPD' in texts[0] or ('Chicago' in texts[0] and 'Police' in texts[0])):
            return texts
        return []

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

    def build_all_responses(self, names, reply_to):
        officers = []
        investigators = []

        for name in names:
            search_results = SuggestOfficerName.query(name)
            if search_results['Officer']:
                officer = Officer.objects.get(pk=search_results['Officer'][0]['tag_value']['value'])
                if officer not in officers:
                    officers.append(officer)

            search_results = SuggestInvestigator.query(name)
            if search_results['Investigator']:
                investigator = Investigator.objects.get(pk=search_results['Investigator'][0]['tag_value']['value'])
                if investigator not in investigators:
                    investigators.append(investigator)

        responses = []
        if officers:
            responses += self.build_responses(officers, 'officer', reply_to)
        if investigators:
            responses += self.build_responses(investigators, 'investigator', reply_to)
        return responses

    def build_responses(self, objs, response_type, reply_to):
        responses = []
        try:
            response_template = Response.objects.get(response_type=response_type)

            for obj in objs:
                context = {'obj': obj}
                context['reply_to'] = reply_to
                msg = response_template.get_message(context)

                if msg:
                    responses.append(msg)
        except Response.DoesNotExist:
            logging.error('Response type {type} does not exists in database'.format(type=response_type))

        return responses

    def convert_quoted_status(self, status):
        new_status = copy.deepcopy(status)
        new_status['user'] = type('X', (object, ), new_status['user'])
        return type('Status', (object, ), new_status)
