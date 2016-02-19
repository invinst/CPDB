import json
from unittest.case import skip

import requests

from django.core.urlresolvers import reverse

from common.tests.core import SimpleTestCase


def get_children_total(children):
    total = 0
    for child in children:
        if 'children' in child:
            total += get_children_total(child['children'])
        if 'size' in child:
            total += child['size']

    return total


class LiveIntegrityTest(SimpleTestCase):
    base_url = 'http://cpdb.co'
    skip_msg = 'Only need to run after production deploy, with live data'

    def get(self, *args):
        ret = requests.get(*args)
        self.response = ret
        return json.loads(ret.content.decode('utf-8'))

    @skip(skip_msg)
    def test_autosuggest_investigator(self):

        url = "{base}{path}".format(base=self.base_url, path=reverse('search:suggest'))

        data = self.get(url, {'term': 'Kymberly Re'})

        data.should.contain('Investigator')
        data['Investigator'][0]['label'].should.equal('Kymberly Reynolds (159)')

    @skip(skip_msg)
    def test_sunburst(self):

        url = 'http://cpdb.co/api/officer-allegations/sunburst/?'
        data = self.get(url)

        total = get_children_total(data['sunburst']['children'])
        total.should.equal(56384)

        get_children_total(data['sunburst']['children'][0]['children']).should.equal(54089)
        get_children_total(data['sunburst']['children'][1]['children']).should.equal(2295)

    @skip(skip_msg)
    def test_complaint_rows_unsustained(self):
        url = 'http://cpdb.co/api/officer-allegations/?final_finding_text=unsustained&page=1&length=50'

        data = self.get(url)

        data['analytics']['All'].should.equal(54089)
        len(data['officer_allegations']).should.equal(50)
