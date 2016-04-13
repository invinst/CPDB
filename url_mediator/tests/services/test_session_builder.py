from collections import OrderedDict

from mock import MagicMock

from allegation.factories import OfficerFactory
from common.tests.core import SimpleTestCase
from common.utils.haystack import rebuild_index
from url_mediator.services.session_builder import (ActiveOfficers, ActiveComplaints, Builder, FilterTags,
                                                   AllegationCrid, Node, SimpleNode, FromSuggestions, SuggestionsNode,
                                                   VirtualNode, AllegationType)

from url_mediator.services.url_mediator_suggestion_service import UrlMediatorSuggestionService


class NodeTest(SimpleTestCase):
    def test_build_should_raise_exception(self):
        Node().build.when.called.should.throw(NotImplementedError)

    def test_supported_attributes(self):
        class NotSupportedAttributesNode(Node):
            supported_attributes = ['abc']

        NotSupportedAttributesNode.when.called_with(xyz='123').should.throw(Exception)
        NotSupportedAttributesNode.when.called_with(abc='123').shouldnt.throw(Exception)


class SimpleNodeTest(SimpleTestCase):
    def test_build_without_children(self):
        SimpleNode().build().should.be.equal({})

    def test_build_with_invalid_children(self):
        SimpleNode('1').build.when.called.should.throw(Exception)

    def test_build_with_children(self):
        SimpleNode(SimpleNode()).build().should.be.equal({
            'unknown': {}
        })


class BuilderTest(SimpleTestCase):
    def test_node_name_should_be_root(self):
        Builder().should.have.property('node_name').being.equal('root')


class ActiveOfficersTest(SimpleTestCase):
    def test_node_name_should_be_active_officers(self):
        ActiveOfficers().should.have.property('node_name').being.equal('active_officers')

    def test_supported_attributes_should_be_pks(self):
        ActiveOfficers.when.called_with(something_not_pks='123').should.throw(Exception)
        ActiveOfficers.when.called_with(pks='123').shouldnt.throw(Exception)

    def test_build(self):
        ActiveOfficers(pks=[123]).build().should.be.equal([123])


class ActiveComplaintsTest(SimpleTestCase):
    def test_node_name_should_be_active_complaints(self):
        ActiveComplaints().should.have.property('node_name').being.equal('active_complaints')

    def test_supported_attributes_should_be_crids(self):
        ActiveComplaints.when.called_with(something_not_crids='123').should.throw(Exception)
        ActiveComplaints.when.called_with(crids='123').shouldnt.throw(Exception)

    def test_build(self):
        ActiveComplaints(crids=[123]).build().should.be.equal([123])


class FilterTagsTest(SimpleTestCase):
    def test_node_name_should_be_filters(self):
        FilterTags().should.have.property('node_name').being.equal('filters')

    def test_build_without_children(self):
        FilterTags().build().should.be.equal({})

    def test_build_without_virtual_children(self):
        real_node = Node()
        real_node.node_name = 'name'
        real_node.build = MagicMock(return_value='something')
        FilterTags(real_node).build().should.be.equal({
            'name': 'something'
        })

    def test_build_with_virtual_children(self):
        real_node = Node()
        real_node.node_name = 'name'
        real_node.build = MagicMock(return_value='something')

        virtual_node = VirtualNode()
        virtual_node.build = MagicMock(return_value=[real_node])

        FilterTags(virtual_node).build().should.be.equal({
            'name': 'something'
        })


class AllegationCridTest(SimpleTestCase):
    def test_node_name_should_be_allegation__crid(self):
        AllegationCrid().should.have.property('node_name').being.equal('allegation__crid')

    def test_supported_attributes_should_be_crids(self):
        AllegationCrid.when.called_with(something_not_crids='123').should.throw(Exception)
        AllegationCrid.when.called_with(crids='123').shouldnt.throw(Exception)

    def test_build(self):
        AllegationCrid(crids=[123]).build().should.be.equal([{
            "displayValue": '123',
            "value": '123',
            "category": "allegation__crid",
            "pinned": False,
            "displayCategory": "Allegation ID"
        }]
        )


class AllegationTypeTest(SimpleTestCase):
    def test_node_name_should_be_cat(self):
        AllegationType().should.have.property('node_name').being.equal('cat')

    def test_supported_attributes_should_be_categories(self):
        AllegationType.when.called_with(something_not_crids='123').should.throw(Exception)
        AllegationType.when.called_with(categories=[(1, 2)]).shouldnt.throw(Exception)

    def test_build(self):
        AllegationType(categories=[('value', 'displayValue')]).build().should.be.equal([{
            "displayValue": 'displayValue',
            "value": 'value',
            "category": "cat",
            "pinned": False,
            "displayCategory": "Allegation Type"
        }]
        )


class SuggestionNodeTest(SimpleTestCase):
    def test_build(self):
        suggestions = [{
            'tagValue': {
                'key': 'value'
            }
        }]

        SuggestionsNode(suggestions=suggestions).build().should.be.equal([{
            'key': 'value',
            'pinned': False
        }])


class FromSuggestionsTest(SimpleTestCase):
    def test_build(self):
        suggestions = OrderedDict({
            'Officer': [{
                'suggestValue': 'John Burzinski (41)',
                'tagValue': {
                    'category': 'officer',
                    'displayCategory': 'Officer',
                    'displayValue': 'John Burzinski',
                    'value': 894
                }
            }]
        })

        built_nodes = FromSuggestions(
            suggestions=suggestions
        ).build()
        built_nodes.should.have.length_of(1)
        built_node = built_nodes[0]
        built_node.should.be.a(SuggestionsNode)
        built_node.build().should.be.equal([{
            'displayValue': 'John Burzinski',
            'category': 'officer',
            'displayCategory': 'Officer',
            'pinned': False,
            'value': 894
        }])


class SessionBuilderIntegrationTest(SimpleTestCase):
    def test_empty_session_builder(self):
        session = Builder().build()
        session.should.be.equal({})

    def test_session_builder_with_active_officer(self):
        session = Builder(
            ActiveOfficers(pks=[123, 456])
        ).build()

        session.should.be.equal({'active_officers': [123, 456]})

    def test_session_builder_with_active_complaints(self):
        session = Builder(
            ActiveComplaints(crids=[123, 456])
        ).build()

        # FIXME: Change session's activeComplaints to active_complaints
        session.should.be.equal({'active_complaints': [123, 456]})

    def test_session_build_from_suggestion(self):
        officer = OfficerFactory()
        rebuild_index()
        suggestions = UrlMediatorSuggestionService().make_suggestion(officer.officer_first)

        session = Builder(
            FilterTags(
                FromSuggestions(suggestions=suggestions)
            )).build()

        officer_name = "{officer_first} {officer_last}".format(
            officer_first=officer.officer_first,
            officer_last=officer.officer_last
        )

        session.should.have.length_of(1)
        session.should.be.equal({
            'filters': {
                'officer': [{
                    'category': 'officer',
                    'displayCategory': "Officer",
                    'displayValue': officer_name,
                    'pinned': False,
                    'value': officer.pk
                }]
            }
        })

    def test_session_builder_with_filter_tags(self):
        session = Builder(
            FilterTags(
                AllegationCrid(crids=[309887])
            )).build()

        # FIXME: Change session's activeComplaints to active_complaints
        session.should.be.equal({
            'filters': {
                'allegation__crid': [{
                    'category': 'allegation__crid',
                    'displayCategory': 'Allegation ID',
                    'displayValue': '309887',
                    'pinned': False,
                    'value': '309887'
                }]
            }
        }
        )
