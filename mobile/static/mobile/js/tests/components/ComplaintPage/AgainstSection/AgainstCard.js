var f, AgainstCard, InvestigationTimeline, OfficerCard, AppHistory;

var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var sinon = require('sinon');
require('should');

f = require('utils/tests/f');

AgainstCard = require('components/ComplaintPage/AgainstSection/AgainstCard.react');
AppHistory = require('utils/History');
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

    againstCard.should.render([InvestigationTimeline]);
  });

  it('should not render `InvestigationTimeline` as sub-component if useSameTimeline is true', function () {
    var officerAllegation = f.create('OfficerAllegation');

    againstCard = ReactTestUtils.renderIntoDocument(
      <AgainstCard officerAllegation={ officerAllegation } shouldRenderTimelineOutside={ true } />
    );

    againstCard.should.not.render([InvestigationTimeline]);
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

  it('should push officerUrl to AppHistory', function () {
    var officerAllegation = f.create('OfficerAllegation');
    var officerDisplayName = officerAllegation.officer['officer_first'] +
      ' ' + officerAllegation.officer['officer_last'];
    var expectedUrl = '/officer/' + officerDisplayName + '/' + officerAllegation.officer.id;
    var OfficerNode;

    var mock = sinon.mock(AppHistory);
    mock.expects('pushState').once().withArgs(null, expectedUrl).returns(null);

    againstCard = ReactTestUtils.renderIntoDocument(
      <AgainstCard officerAllegation={ officerAllegation } />
    );

    OfficerNode = ReactTestUtils.scryRenderedComponentsWithType(againstCard, OfficerCard)[0];

    ReactTestUtils.Simulate.click(ReactDOM.findDOMNode(OfficerNode));

    mock.verify();
    mock.restore();
  });

});
