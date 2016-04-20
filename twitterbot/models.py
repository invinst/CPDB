import re

from django.conf import settings
from django.db import models
from django.template.base import Template
from django.template.context import Context

from twitterbot.utils.tweet import build_tweet_permalink

TYPE_CHOICES = [
    ['officer', 'officer'],
    ['investigator', 'investigator']
]


class ResponseTemplate(models.Model):
    response_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    message = models.TextField()

    def get_message(self, context):
        '''
        Build response message with passed context
        :param context: required an obj instance to display information
                        {user} and {reply_to} to generate correct response
        :return:
        '''
        t = Template(self.message)
        return t.render(Context(context))

    def __str__(self):
        return self.response_type


class TwitterBotError(models.Model):
    stack_trace = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)


class TwitterBotResponseLog(models.Model):
    matched_strings = models.TextField(null=True, blank=True)
    entity_url = models.URLField()  # officer, investigator url

    tweet_url = models.URLField()
    tweet_content = models.TextField()
    tweeted_at = models.DateTimeField()

    incoming_tweet_username = models.CharField(max_length=50)
    incoming_tweet_url = models.URLField()
    incoming_tweet_content = models.TextField()

    originating_tweet_username = models.CharField(max_length=50, null=True, blank=True)
    originating_tweet_url = models.URLField(null=True, blank=True)
    originating_tweet_content = models.TextField(null=True, blank=True)


class TwitterResponse:
    def __init__(self, *args, **kwargs):
        self.entity = kwargs.get('entity', None)

        self.message = kwargs.get('message', '')
        self.matched_strings = kwargs.get('matched_strings', [])

        self.recipients = kwargs.get('recipients', [])
        self.incoming_tweet = kwargs.get('incoming_tweet', None)
        self.originating_tweet = kwargs.get('originating_tweet', None)

    def build_user_responses(self):
        self.update_message_url()

        messages = []
        for recipient in self.recipients:
            message = self.message.replace('{user}', recipient)
            messages.append(message)

        return messages

    def update_message_url(self):
        self.entity_url = '{base}{absolute_url}?reply_to={incoming_tweet_id}'.format(
            base=settings.TWITTER_ENTITY_URL_BASE,
            absolute_url=self.entity.absolute_view_url,
            incoming_tweet_id=self.incoming_tweet.id)
        self.message = self.message.replace('{url}', self.entity_url)

    def save_log(self, outgoing_tweet):
        log = TwitterBotResponseLog(
            incoming_tweet_content=self.incoming_tweet.text,
            incoming_tweet_url=build_tweet_permalink(self.incoming_tweet),
            incoming_tweet_username=self.incoming_tweet.user.screen_name,
            tweet_content=outgoing_tweet.text,
            tweet_url=build_tweet_permalink(outgoing_tweet),
            tweeted_at=outgoing_tweet.created_at,
            entity_url=self.entity_url,
            matched_strings=self.matched_strings
        )

        if self.originating_tweet:
            log.originating_tweet_content = self.originating_tweet.text
            log.originating_tweet_url = build_tweet_permalink(self.originating_tweet)
            log.originating_tweet_username = self.originating_tweet.user.screen_name

        log.save()


class TwitterBotTextSource:
    def __init__(self, *args, **kwargs):
        self.text = kwargs.get('text', '')
        self.source = kwargs.get('source', 'text')

    def build_names(self):
        # TODO: find better way to find names
        return self._build_names(word_length=2) + self._build_names(word_length=3)

    def _build_names(self, word_length=2):
        names = []
        text = self.sanitize_text(self.text)

        splitted = text.split(' ')
        max_index = len(splitted)

        for i in range(max_index - (word_length - 1)):
            name = ' '.join(splitted[i:i+word_length])
            if name and name != ' ' and len(name) > 6:
                if self.source == 'text':
                    names.append((name, name))
                else:
                    names.append((name, self.source))

        return names

    def sanitize_text(self, text):
        text = re.sub('(\t|\n|\r|\s)+', ' ', text)
        text = re.sub('[^A-Za-z0-9]+', ' ', text)
        text = text.strip()

        return text
