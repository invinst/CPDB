import json
from collections import OrderedDict


class SuggestFormatService(object):
    def format(self, data):
        ret = self.to_jquery_ui_autocomplete_format(data)
        return ret

    def to_jquery_ui_autocomplete_format(self, data):
        new_dict = OrderedDict()

        for category in data:
            new_dict[category] = [
                {
                    'category': category,
                    'value': entry['value'],
                    'label': entry['label'], # for displaying autocomplete row
                    'filter': entry['filter']
                } for entry in data[category]
            ]

        return new_dict
