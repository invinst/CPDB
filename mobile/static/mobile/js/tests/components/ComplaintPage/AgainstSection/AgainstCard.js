var f, AgainstCard, InvestigationTimeline, OfficerCard;

var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');

require('should');

f = require('utils/tests/f');

AgainstCard = require('components/ComplaintPage/AgainstSection/AgainstCard.react');
InvestigationTimeline = require('components/ComplaintPage/AgainstSection/AgainstCard/InvestigationTimeline.react');
OfficerCard = require('components/Shared/OfficerCard.react');


describe('AgainstCardComponent', function () {
  var againstCard;

  it('should be renderable', function () {
    againstCard = ReactTestUtils.renderIntoDocument(
      <AgainstCard />
    );

    againstCard.should.be.ok;
  });

  it('should render `OfficerCard` as sub-component', function () {
    var officerAllegation = f.create('OfficerAllegation');

    againstCard = ReactTestUtils.renderIntoDocument(
      <AgainstCard officerAllegation={ officerAllegation } />
    );

    ReactTestUtils.findRenderedComponentWithType(againstCard, OfficerCard).should.be.ok;
  });

  it('should render `InvestigationTimeline` as sub-component if useSameTimeline by default', function () {
    var officerAllegation = f.create('OfficerAllegation');

    againstCard = ReactTestUtils.renderIntoDocument(
      <AgainstCard officerAllegation={ officerAllegation } />
    );

    ReactTestUtils.findRenderedComponentWithType(againstCard, InvestigationTimeline).should.be.ok;
  });

  it('should not render `InvestigationTimeline` as sub-component if useSameTimeline is true', function () {
    var officerAllegation = f.create('OfficerAllegation');

    againstCard = ReactTestUtils.renderIntoDocument(
      <AgainstCard officerAllegation={ officerAllegation } shouldRenderTimelineOutside={ true } />
    );

    ReactTestUtils.scryRenderedComponentsWithType(againstCard, InvestigationTimeline).should.have.length(0);
  });

  it('should show `Gender unknown` and `Race unknown` if they are empty', function () {
    var component;
    var officer = f.create('Officer', {
      'gender': '',
      'race': ''
    });
    var officerAllegation = f.create('OfficerAllegation', {'officer': officer});

    againstCard = ReactTestUtils.renderIntoDocument(
      <AgainstCard officerAllegations={ officerAllegation } />
    );

    component = ReactTestUtils.findRenderedDOMComponentWithClass(againstCard, 'against-card');
    component.textContent.should.containEql('Gender unknown');
    component.textContent.should.containEql('Race unknown');
  });

});
