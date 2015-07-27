import datetime


def month_name(number):
    return datetime.date(2011, number, 1).strftime('%B')

def month_choices():
    return map(lambda x: (x, month_name(x)), range(1, 13))

def current_year():
    return datetime.datetime.now().year

def month_year_entry(month, year):
    return ["%s %s" % (month[1], year), "%s-%s" % (year, month[0])]

def generate_month_year_entry_from_2010(month):
    results = []

    for year in range(2010, current_year()):
        results.append(month_year_entry(month, year))

    return results
