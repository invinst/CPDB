from django.core.management.base import BaseCommand
from django.db.models.aggregates import Count
from common.models import Officer, ComplainingWitness


RACES = [
    ['WHITE', 'White'],
    ['BLACK', 'Black'],
    ["UNKNOWN", 'Unknown'],
    ['ASIAN/PACIFIC ISLANDER', 'Asian'],
    ['AMER IND/ALASKAN NATIVE', 'Indigenous'],
    ['WHITE HISPANIC', 'White/Hispanic'],
    ['BLACK HISPANIC', 'Black/Hispanic'],
    ['HISPANIC', 'Hispanic']
]

class Command(BaseCommand):
    def clean_races(self, queryset):
        for race in RACES:
            queryset.filter(race__iexact=race[0]).update(race=race[1])

    def handle(self, *args, **options):
        self.clean_races(Officer.objects.all())
        self.clean_races(ComplainingWitness.objects.all())
