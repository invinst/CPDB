var ThreeNodesTimeline;

var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');

var should = require('should');

var f = require('utils/tests/f');
require('utils/tests/should/React');

ThreeNodesTimeline = require(
  'components/ComplaintPage/AgainstSection/AgainstCard/InvestigationTimeline/ThreeNodesTimeline.react');


describe('ThreeNodesTimelineComponent', function () {
  var threeNodesTimeline;

  it('should be renderable', function () {
    ThreeNodesTimeline.should.be.renderable();
  });

  it('should be show incident date, final status, start date, end date', function () {
    var incidentDate = '2012-10-07T07:30:00';
    var startDate = '2012-01-18';
    var endDate = '2012-01-19';
    var expectedDate = 'Oct 07, 2012';
    var allegation = f.create('Allegation', {'incident_date': incidentDate});
    var officerAllegation = f.create('OfficerAllegation',
      {
        'start_date': startDate,
        'end_date': endDate,
        'final_outcome_class': 'open-investigation'
      });
    threeNodesTimeline = ReactTestUtils.renderIntoDocument(
      <ThreeNodesTimeline allegation={ allegation } officerAllegation={ officerAllegation } />
    );

    ReactTestUtils.findRenderedDOMComponentWithClass(threeNodesTimeline, 'incident-date')
      .textContent.should.be.eql(expectedDate);
    ReactTestUtils.findRenderedDOMComponentWithClass(threeNodesTimeline, 'end-date')
      .textContent.should.be.eql('Jan 19, 2012');
    ReactTestUtils.findRenderedDOMComponentWithClass(threeNodesTimeline, 'start-date')
      .textContent.should.be.eql('Jan 18, 2012');
    ReactTestUtils.findRenderedDOMComponentWithClass(threeNodesTimeline, 'event-title status')
      .textContent.should.be.eql('Open Investigation');
  });

  it('should be show dashLine style for second line if open investigation', function () {
    var line;
    var officerAllegation = f.create('OfficerAllegation', { 'final_outcome_class': 'open-investigation' });
    threeNodesTimeline = ReactTestUtils.renderIntoDocument(
      <ThreeNodesTimeline officerAllegation={ officerAllegation } />
    );

    line = ReactTestUtils.findRenderedDOMComponentWithClass(threeNodesTimeline, 'second-line');
    line.getAttribute('style').should.containEql('non-scaling-stroke');
  });

  it('should be show no style for second line if not open investigation', function () {
    var line;
    var officerAllegation = f.create('OfficerAllegation', { 'final_outcome_class': 'not-sustained' });
    threeNodesTimeline = ReactTestUtils.renderIntoDocument(
      <ThreeNodesTimeline officerAllegation={ officerAllegation } />
    );

    line = ReactTestUtils.findRenderedDOMComponentWithClass(threeNodesTimeline, 'second-line');
    should(line.getAttribute('style')).be.exactly(null);
  });

  it('should be show dashLine style for first line if there is incident date', function () {
    var line;
    var incidentDate = '2012-10-07T07:30:00';
    var allegation = f.create('Allegation', {'incident_date': incidentDate});
    threeNodesTimeline = ReactTestUtils.renderIntoDocument(
      <ThreeNodesTimeline allegation={ allegation } />
    );

    line = ReactTestUtils.findRenderedDOMComponentWithClass(threeNodesTimeline, 'first-line');
    line.getAttribute('style').should.containEql('non-scaling-stroke');
  });

  it('should be show no style for first line if there is no incident date', function () {
    var line;
    threeNodesTimeline = ReactTestUtils.renderIntoDocument(
      <ThreeNodesTimeline />
    );

    line = ReactTestUtils.findRenderedDOMComponentWithClass(threeNodesTimeline, 'first-line');
    should(line.getAttribute('style')).be.exactly(null);
  });

  it('should show `Unknown date` if incident date is empty', function () {
    var line;
    var incidentDate = '';
    var allegation = f.create('Allegation', {'incident_date': incidentDate});

    threeNodesTimeline = ReactTestUtils.renderIntoDocument(
      <ThreeNodesTimeline allegation={ allegation } />
    );
    line = ReactTestUtils.findRenderedDOMComponentWithClass(threeNodesTimeline, 'incident-date');
    line.textContent.should.containEql('Unknown date');
  });
});
