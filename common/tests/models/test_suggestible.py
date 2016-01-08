from django.template.defaultfilters import slugify
from django.test import TestCase

from allegation.factories import (
    OfficerFactory, AllegationFactory, OfficerAllegationFactory)
from common.models.suggestible import MobileSuggestible


class MobileSuggestibleTest(TestCase):
    def setUp(self):
        self.suggestible = MobileSuggestible()

    def test_get_url(self):
        self.suggestible.get_mobile_url.when.called.should.throw(NotImplementedError)

    def test_suggestion_entry(self):
        self.suggestible.as_suggestion_entry.when.called.should.throw(NotImplementedError)


class MobileSuggestibleOfficerTest(TestCase):
    def setUp(self):
        first_name = 'First'
        last_name = 'Last'
        self.display_name = '{first_name} {last_name}'.format(first_name=first_name, last_name=last_name)
        slugified_display_name = slugify(self.display_name)
        self.officer = OfficerFactory(officer_first=first_name, officer_last=last_name)
        self.officer_id = self.officer.id
        self.expected_url = '/officer/{name}/{id}'.format(name=slugified_display_name, id=self.officer_id)

    def test_get_url(self):
        self.officer.get_mobile_url().should.equal(self.expected_url)

    def test_suggestion_entry(self):
        expected_entry = {
            'text': self.display_name,
            'resource': 'officer',
            'resource_key': self.officer_id,
            'url': self.expected_url,
            'meta': {
                'allegations_count': self.officer.allegations_count,
                'gender': self.officer.gender,
                'race': self.officer.race,
                'star': self.officer.star
            }
        }
        self.officer.as_suggestion_entry().should.be.equal(expected_entry)


class MobileSuggestibleAllegationTest(TestCase):
    def setUp(self):
        self.crid = '1011111'
        self.allegation = AllegationFactory(crid=self.crid)
        OfficerAllegationFactory(allegation=self.allegation)
        self.expected_url = '/complaint/{crid}'.format(crid=self.crid)

    def test_get_url(self):
        self.allegation.get_mobile_url().should.equal(self.expected_url)

    def test_suggestion_entry(self):
        cat = self.allegation.officerallegation_set.first().cat
        expected_entry = {
            'text': self.crid,
            'resource': 'allegation',
            'resource_key': self.crid,
            'url': self.expected_url,
            'meta': {
                'incident_date': self.allegation.incident_date,
                'cat': {
                    'allegation_name': cat.allegation_name,
                    'category': cat.category
                }
            }
        }
        self.allegation.as_suggestion_entry().should.be.equal(expected_entry)
