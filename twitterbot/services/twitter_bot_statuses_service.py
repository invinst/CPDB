import copy

import datetime


class TwitterBotStatusesService:
    def __init__(self, api):
        self.api = api

    def get_all_related_statuses(self, status):
        statuses = [status]

        if hasattr(status, 'retweeted_status') and status.retweeted_status:
            statuses += self.get_all_related_statuses(status.retweeted_status)

        if hasattr(status, 'quoted_status') and status.quoted_status:
            statuses += self.get_all_related_statuses(self._convert_quoted_status(status.quoted_status))
        elif hasattr(status, 'quoted_status_id_str') and status.quoted_status_id_str:
            quoted_status = self.api.get_status(status.quoted_status_id_str)
            statuses += self.get_all_related_statuses(quoted_status)

        return statuses

    def _convert_quoted_status(self, status):
        new_status = copy.deepcopy(status)
        new_status['user'] = type('X', (object, ), new_status['user'])
        new_status['created_at'] = datetime.datetime.strptime(new_status['created_at'], '%a %b %d %H:%M:%S %z %Y')\
            .replace(tzinfo=None)
        return type('Status', (object, ), new_status)
