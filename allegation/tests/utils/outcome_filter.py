from allegation.services.outcome_analytics import FILTERS


def number_of_all_created_complaints():
    return sum(len(x) for x in FILTERS.values())
