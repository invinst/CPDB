import logging

from twitterbot.models import Response


class BaseResponses:
    RESPONSE_TYPE = ''

    def __init__(self, names):
        self.names = names

    def get_instances_from_names(self, names):
        raise NotImplementedError

    def build_responses(self):
        responses = []
        objs = self.get_instances_from_names(self.names)
        try:
            response_template = Response.objects.get(response_type=self.RESPONSE_TYPE)

            for obj in objs:
                msg = response_template.get_message({'obj': obj})

                if msg:
                    responses.append(msg)
        except Response.DoesNotExist:
            logging.error('Response type {type} does not exist in database'.format(type=self.RESPONSE_TYPE))

        return responses
