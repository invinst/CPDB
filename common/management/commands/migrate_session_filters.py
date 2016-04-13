from django.core.management.base import BaseCommand

from share.models import Session


class Command(BaseCommand):
    help = 'Calculate officer complaints count'

    def migrate_session_query(self, session):
        new_query_filters = {}

        for display_category, filters in session.query['filters'].items():
            new_filters = []
            for filter in filters:
                splitted_filter = filter['filter'].split('=')
                category = splitted_filter[0]
                value = splitted_filter[1]

                new_filters.append({
                    'category': category,
                    'value': value,
                    'displayCategory': display_category,
                    'displayValue': filter['value']
                })

            new_query_filters[category] = new_filters

        return new_query_filters

    def handle(self, *args, **options):
        for session in Session.objects.all():
            if session.query and session.query.get('filters'):
                session.query['filters'] = self.migrate_session_query(session)
                session.save()
