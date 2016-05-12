import random
from datetime import datetime

import factory
import pytz

from allegation.factories import OfficerFactory
from twitterbot.constants import QUOTED_STATUS_DATE_FORMAT
from twitterbot.models import ResponseTemplate, TYPE_CHOICES


class ResponseTemplateFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ResponseTemplate

    response_type = factory.Sequence(lambda n: random.choice(TYPE_CHOICES))
    message = '{user} {{obj}} {reply_to}'


class TweetFactory:
    def __init__(self, screen_name='tweeter', text='Random text here', retweeted_status=None, quoted_status=None,
                 quoted_status_id_str='', user_id=123, in_reply_to_status_id=None, **kwargs):
        self.text = text
        self.entities = {'user_mentions': kwargs.get('user_mentions', [{'screen_name': screen_name}]),
                         'urls': kwargs.get('urls', []),
                         'hashtags': kwargs.get('hashtags', [])}
        self.user = type('obj', (object,), {'screen_name': screen_name, 'id': user_id})
        self.retweeted_status = retweeted_status
        self.quoted_status = quoted_status
        self.quoted_status_id_str = quoted_status_id_str
        self.id = kwargs.get('id', random.randint(1, 10))
        self.created_at = kwargs.get('created_at', datetime.now())
        self.in_reply_to_status_id = in_reply_to_status_id


def QuotedTweetFactory(screen_name='tweeter', text='Random text here', retweeted_status=None, quoted_status=None,
                       quoted_status_id_str='', user_id=123, in_reply_to_status_id=None, **kwargs):
    return {
        'text': text,
        'entities': {'user_mentions': kwargs.get('user_mentions', [{'screen_name': screen_name}]),
                     'urls': kwargs.get('urls', []),
                     'hashtags': kwargs.get('hashtags', [])},
        'user': {'screen_name': screen_name, 'id': user_id},
        'retweeted_status': retweeted_status,
        'quoted_status': quoted_status,
        'quoted_status_id_str': quoted_status_id_str,
        'id': kwargs.get('id', random.randint(1, 10)),
        'created_at': kwargs.get('created_at', datetime.now(pytz.utc).strftime(QUOTED_STATUS_DATE_FORMAT)),
        'in_reply_to_status_id': in_reply_to_status_id,
    }


class TwitterResponseFactory:
    def __init__(self, **kwargs):
        self.message = kwargs.get('message', 'message')
        self.entity = kwargs.get('entity', OfficerFactory())
        self.entity_url = kwargs.get('entity_url', 'entity_url')
        self.matched_string = kwargs.get('matched_string', 'matched_string')
