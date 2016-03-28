var f, InvestigatorSection;

var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');

require('should');

require('utils/tests/should/React');
f = require('utils/tests/f');

InvestigatorSection = require('components/ComplaintPage/InvestigatorSection.react');


describe('InvestigatorSection component', function () {
  var investigatorSection;

  it('should be renderable', function () {
    investigatorSection = ReactTestUtils.renderIntoDocument(
      <InvestigatorSection/>
    );

    investigatorSection.should.be.ok;
  });

  it('should show investigator', function () {
    var investigator = f.create('Investigator');
    var allegation = f.create('Allegation', {'investigator' : investigator});

    investigatorSection = ReactTestUtils.renderIntoDocument(
      <InvestigatorSection allegation={ allegation }/>
    );

    ReactTestUtils.findRenderedDOMComponentWithClass(investigatorSection, 'investigator-card').should.be.ok;
  });

  it('should not show anything if there is no investigator', function () {

    investigatorSection = ReactTestUtils.renderIntoDocument(
      <InvestigatorSection />
    );

    investigatorSection.should.renderNothing();
  });

  it('should show investigator name and current rank', function () {
    var investigator = f.create('Investigator', {'name': 'John', 'current_rank': 'SERGEANT OF POLICE'});
    var allegation = f.create('Allegation', {'investigator' : investigator});

    investigatorSection = ReactTestUtils.renderIntoDocument(
      <InvestigatorSection allegation={ allegation }/>
    );

    ReactTestUtils.findRenderedDOMComponentWithClass(investigatorSection, 'name bold')
      .textContent.should.containEql(investigator.name);
    ReactTestUtils.findRenderedDOMComponentWithClass(investigatorSection, 'rank')
      .textContent.should.containEql(investigator.current_rank);
  });

  it('should show current rank `Rank unknown` if current rank is empty', function () {
    var investigator = f.create('Investigator', {'current_rank': ''});
    var allegation = f.create('Allegation', {'investigator' : investigator});

    investigatorSection = ReactTestUtils.renderIntoDocument(
      <InvestigatorSection allegation={ allegation }/>
    );

    ReactTestUtils.findRenderedDOMComponentWithClass(investigatorSection, 'rank')
      .textContent.should.containEql('Rank unknown');
  });
});

