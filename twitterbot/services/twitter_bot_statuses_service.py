import copy

from datetime import datetime

from twitterbot.constants import QUOTED_STATUS_DATE_FORMAT


class TwitterBotStatusesService:
    def __init__(self, api):
        self.api = api

    def get_all_related_statuses(self, status):
        statuses = [status]

        if getattr(status, 'in_reply_to_status_id', None):
            replied_status = self.api.get_status(status.in_reply_to_status_id)
            statuses += self.get_all_related_statuses(replied_status)

        if getattr(status, 'retweeted_status', None):
            statuses += self.get_all_related_statuses(status.retweeted_status)

        if getattr(status, 'quoted_status', None):
            statuses += self.get_all_related_statuses(self._convert_quoted_status(status.quoted_status))
        elif getattr(status, 'quoted_status_id_str', None):
            quoted_status = self.api.get_status(status.quoted_status_id_str)
            statuses += self.get_all_related_statuses(quoted_status)

        return statuses

    def _convert_quoted_status(self, status):
        new_status = copy.deepcopy(status)
        new_status['user'] = type('X', (object, ), new_status['user'])
        new_status['created_at'] = datetime.strptime(new_status['created_at'], QUOTED_STATUS_DATE_FORMAT)\
            .replace(tzinfo=None)
        return type('Status', (object, ), new_status)
