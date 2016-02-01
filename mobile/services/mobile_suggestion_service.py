from allegation.utils.query import OfficerQuery
from common.constants import ALLEGATION_LIMIT
from common.models import Officer, Allegation


# TODO: Considering refactor this suggestion service by a better design, may use the same strategy which will
# be used in desktop one.
def wrap_as_suggestion(suggestion):
    return [suggestion.as_suggestion_entry()] if suggestion else []


def suggest_officer_star(query):
    try:
        star = float(query)
    except ValueError:
        return []

    officer = Officer.objects.filter(star=star).first()
    return wrap_as_suggestion(officer)


def suggest_crid(query):
    allegation = Allegation.objects.filter(crid=query).first()
    return wrap_as_suggestion(allegation)


def suggest_officer_name(query):
    officers = Officer.objects.filter(OfficerQuery.condition_by_name(query))\
        .order_by('-allegations_count')[:ALLEGATION_LIMIT]
    suggestions = [officer.as_suggestion_entry() for officer in officers]
    return suggestions


def suggest(query):
    suggesters = [suggest_officer_name, suggest_crid, suggest_officer_star]
    results = []

    for suggester in suggesters:
        results.extend(suggester(query))

    return results
