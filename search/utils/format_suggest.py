from collections import OrderedDict


def to_jquery_ui_autocomplete_format(data):
    formatted_data = OrderedDict()

    for category in data:
        formatted_data[category] = [
            {
                'category': category,
                'value': entry['value'],
                'label': entry['label'],  # for displaying autocomplete row
                'filter': entry['filter']
            } for entry in data[category]
        ]

    return formatted_data


def format_suggest(data):
    return to_jquery_ui_autocomplete_format(data)
