import logging

from twitterbot.models import ResponseTemplate


class BaseResponses:
    RESPONSE_TYPE = ''

    def __init__(self, names):
        self.names = names

    def get_instances_from_names(self):
        raise NotImplementedError

    def build_responses(self):
        responses = self.get_instances_from_names()
        try:
            response_template = ResponseTemplate.objects.get(response_type=self.RESPONSE_TYPE)

            for response in responses:
                msg = response_template.get_message({'obj': response.entity})

                if msg:
                    response.message = msg
        except ResponseTemplate.DoesNotExist:
            logging.error('Response type {type} does not exist in database'.format(type=self.RESPONSE_TYPE))

        return responses
