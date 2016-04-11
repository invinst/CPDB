from django.test import TestCase

from allegation.factories import (
    OfficerFactory, AllegationFactory, OfficerAllegationFactory)
from common.models.suggestible import MobileSuggestible


class MobileSuggestibleTest(TestCase):
    def setUp(self):
        self.suggestible = MobileSuggestible()

    def test_suggestion_entry(self):
        self.suggestible.as_suggestion_entry.when.called.should.throw(NotImplementedError)


class MobileSuggestibleOfficerTest(TestCase):
    def setUp(self):
        first_name = 'First'
        last_name = 'Last'
        self.display_name = '{first_name} {last_name}'.format(first_name=first_name, last_name=last_name)
        self.officer = OfficerFactory(officer_first=first_name, officer_last=last_name)
        self.officer_id = self.officer.id

    def test_suggestion_entry(self):
        expected_entry = {
            'text': self.display_name,
            'resource': 'officer',
            'resource_key': self.officer_id,
            'meta': {
                'officer': self.officer
            }
        }
        self.officer.as_suggestion_entry().should.be.equal(expected_entry)


class MobileSuggestibleAllegationTest(TestCase):
    def test_suggestion_entry(self):
        crid = '1011111'
        allegation = AllegationFactory(crid=crid)
        OfficerAllegationFactory(allegation=allegation)

        expected_entry = {
            'text': crid,
            'resource': 'officer_allegation',
            'resource_key': crid,
            'meta': {
                'allegation': allegation
            }
        }

        allegation.as_suggestion_entry().should.be.equal(expected_entry)

    def test_suggestion_entry_without_category(self):
        crid = '1011111'
        allegation = AllegationFactory(crid=crid)
        OfficerAllegationFactory(allegation=allegation, cat=None)

        expected_entry = {
            'text': crid,
            'resource': 'officer_allegation',
            'resource_key': crid,
            'meta': {
                'allegation': allegation
            }
        }
        allegation.as_suggestion_entry().should.be.equal(expected_entry)
