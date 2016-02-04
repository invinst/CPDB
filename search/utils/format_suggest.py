from collections import OrderedDict


def to_jquery_ui_autocomplete_format(data):
    formatted_data = OrderedDict()

    for category in data:
        formatted_data[category] = [
            {
                'suggestValue': entry['suggest_value'],
                'tagValue': {
                    'category': entry['tag_value']['category'],
                    'value': entry['tag_value']['value'],
                    'displayCategory': entry['tag_value']['display_category'],
                    'displayValue': entry['tag_value']['display_value']
                }
            } for entry in data[category]
        ]

    return formatted_data


def format_suggest(data):
    return to_jquery_ui_autocomplete_format(data)
