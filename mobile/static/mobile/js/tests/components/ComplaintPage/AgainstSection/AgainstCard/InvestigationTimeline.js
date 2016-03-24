var f, InvestigationTimeline, ThreeNodesTimeline, TwoNodesTimeline;

var React = require('react');
var ReactDOMServer = require('react-dom/server');
var ReactTestUtils = require('react-addons-test-utils');

require('should');

f = require('utils/tests/f');

InvestigationTimeline = require('components/ComplaintPage/AgainstSection/AgainstCard/InvestigationTimeline.react');
ThreeNodesTimeline = require(
  'components/ComplaintPage/AgainstSection/AgainstCard/InvestigationTimeline/ThreeNodesTimeline.react');
TwoNodesTimeline = require(
  'components/ComplaintPage/AgainstSection/AgainstCard/InvestigationTimeline/TwoNodesTimeline.react');

describe('InvestigationTimelineComponent', function () {
  var investigaionTimeline;

  it('should be renderable', function () {
    investigaionTimeline = ReactTestUtils.renderIntoDocument(
      <InvestigationTimeline />
    );

    investigaionTimeline.should.be.ok;
  });

  it('should render empty div if do not have enough data', function () {
    investigaionTimeline = ReactDOMServer.renderToStaticMarkup(
      <InvestigationTimeline />
    );

    investigaionTimeline.should.be.equal('<div></div>');
  });

  it('should render TwoNodesTimeline as sub-component if investigation start at incident date', function () {
    var date = '2012-01-19';
    var incidentDate = '2012-01-19T07:30:00';
    var officerAllegation = f.create('OfficerAllegation', {'start_date': date});
    var allegation = f.create('Allegation', {'incident_date': incidentDate});

    investigaionTimeline = ReactTestUtils.renderIntoDocument(
      <InvestigationTimeline officerAllegation={ officerAllegation } allegation={ allegation }/>
    );

    ReactTestUtils.findRenderedComponentWithType(investigaionTimeline, TwoNodesTimeline).should.be.ok;
  });

  it('should render ThreeNodesTimeline as sub-component if investigation start at incident date', function () {
    var incidentDate = '2012-10-07T07:30:00';
    var date = '2012-01-19';
    var officerAllegation = f.create('OfficerAllegation', {'start_date': date});
    var allegation = f.create('Allegation', {'incident_date': incidentDate});

    investigaionTimeline = ReactTestUtils.renderIntoDocument(
      <InvestigationTimeline officerAllegation={ officerAllegation } allegation={ allegation }/>
    );

    ReactTestUtils.findRenderedComponentWithType(investigaionTimeline, ThreeNodesTimeline).should.be.ok;
  });

});
