import oauth2
import json
import requests

from django.db import models
from django.conf import settings
from django.template.base import Template
from django.template.context import Context


def oauth_req(url, http_method="GET", post_body=b"", http_headers=None):
    consumer = oauth2.Consumer(key=settings.TWITTER_CONSUMER_KEY, secret=settings.TWITTER_CONSUMER_SECRET)
    token = oauth2.Token(key=settings.TWITTER_APP_TOKEN_KEY, secret=settings.TWITTER_APP_TOKEN_SECRET)
    client = oauth2.Client(consumer, token)
    resp, content = client.request(url, method=http_method, body=post_body, headers=http_headers)

    return content


TYPE_CHOICES = [
    ['officer', 'officer'],
    ['investigator', 'investigator'],
    ['not_found', 'not_found']
]


class Response(models.Model):
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    message = models.TextField()

    def get_message(self, context):
        t = Template(self.message)
        return t.render(Context(context))

    def __str__(self):
        return self.type


class TwitterSearch(models.Model):
    query = models.CharField(max_length=100)
    refresh_url = models.CharField(max_length=255, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def search(self):
        if self.refresh_url:
            append = self.refresh_url
        else:
            append = "?q=%s" % self.query

        url = "https://api.twitter.com/1.1/search/tweets.json{append}"\
            .format(append=append)
        response = oauth_req(url, "GET")
        return json.loads(response.decode('utf-8'))


class TwitterResponse(models.Model):
    search = models.ForeignKey(TwitterSearch)
    response = models.TextField()
    user = models.CharField(max_length=50, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def send(self):
        escaped = TwitterResponse.escape_response(self.response)
        url = "https://api.twitter.com/1.1/statuses/update.json?status={response}".format(response=escaped)

        print(oauth_req(url, "POST"))

    @classmethod
    def escape_response(cls, response):
        return requests.utils.quote(response, safe='')
