from django.db import models
from django.template.base import Template
from django.template.context import Context


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
