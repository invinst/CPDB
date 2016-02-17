import datetime

START_SEARCHABLE_YEAR = 2010


def month_name(number):
    return datetime.date(2011, number, 1).strftime('%B')


def month_choices():
    return map(lambda x: (x, month_name(x)), range(1, 13))


def current_year():
    return datetime.datetime.now().year


def month_year_entry(month, year):
    return ["%s %s" % (month[1], year), "%s-%s" % (year, month[0])]


def generate_month_year_entry_from_2010(month, year=None):
    results = []

    for y in range(START_SEARCHABLE_YEAR, current_year() + 1):
        if year:
            if str(y).startswith(year):
                results.append(month_year_entry(month, y))
        else:
            results.append(month_year_entry(month, y))

    return results
