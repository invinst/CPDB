from django.core.management.base import BaseCommand

from allegation.views.officer_allegation_sunburst_view import OfficerAllegationSunburstView
from share.models import Session


class Command(BaseCommand):
    help = 'Migrate sunburst arc data because of share 0015'

    def generate_sunburst_category_map(self):
        arcs = OfficerAllegationSunburstView.levels
        new_arcs = {}

        # this is for a quick one off migration
        for arc_1 in arcs:
            new_arcs[arc_1['name']] = arc_1['tagValue']['category']

            children_1 = arc_1.get('children', [])
            for arc_2 in children_1:
                new_arcs[arc_2['name']] = arc_2['tagValue']['category']

                children_2 = arc_2.get('children', [])
                for arc_3 in children_2:
                    new_arcs[arc_3['name']] = arc_3['tagValue']['category']

                    children_3 = arc_3.get('children', [])
                    for arc_4 in children_3:
                        new_arcs[arc_4['name']] = arc_4['tagValue']['category']

        return new_arcs

    def handle(self, *args, **options):
        arc_name_category_map = self.generate_sunburst_category_map()

        count = 0
        for session in Session.objects.all():
            sunburst_arc = session.sunburst_arc
            if sunburst_arc == '':
                sunburst_arc = 'Allegations'
                count += 1
            sunburst_arc_category = arc_name_category_map.get(sunburst_arc, '')

            new_sunburst_arc = {
                'value': sunburst_arc,
                'category': sunburst_arc_category
            }

            print(new_sunburst_arc)

            # session.selected_sunburst_arc = new_sunburst_arc

            # session.save()

            # checking if the change is already in database
            # session.refresh_from_db()
            # if session.selected_sunburst_arc != new_sunburst_arc:
            #     print(session.id)

        print(count, Session.objects.all().count())
        print("Done")
