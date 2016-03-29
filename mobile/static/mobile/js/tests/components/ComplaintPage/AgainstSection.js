var f, AgainstSection, AgainstCard, InvestigationTimeline;

var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');

require('should');

f = require('utils/tests/f');
require('utils/tests/should/React');

AgainstCard = require('components/ComplaintPage/AgainstSection/AgainstCard.react');
AgainstSection = require('components/ComplaintPage/AgainstSection.react');
InvestigationTimeline = require('components/ComplaintPage/AgainstSection/AgainstCard/InvestigationTimeline.react');


describe('AgainstSectionComponent', function () {
  var againstSection;

  it('should be renderable', function () {
    AgainstSection.should.be.renderable();
  });

  it('should render AgainstCard as sub-component', function () {
    var officerAllegations = f.createBatch(1, 'OfficerAllegation');

    againstSection = ReactTestUtils.renderIntoDocument(
      <AgainstSection officerAllegations={ officerAllegations } />
    );

    againstSection.should.render([AgainstCard]);
  });

  it('should render `InvestigationTimeline` as sub-component if more than one officer ' +
    'allegation have the same timeline', function () {
    var officerAllegations = f.createBatch(2, 'OfficerAllegation',
      {'start_date': '2012-01-19', 'end_date': '2012-01-19'});

    againstSection = ReactTestUtils.renderIntoDocument(
      <AgainstSection officerAllegations={ officerAllegations } />
    );

    againstSection.should.render([InvestigationTimeline]);
  });

  it('should render `InvestigationTimeline` inside `AgainstCard` if there is only one officer allegation', function () {
    var againstCard;
    var officerAllegations = f.createBatch(1, 'OfficerAllegation');

    againstSection = ReactTestUtils.renderIntoDocument(
      <AgainstSection officerAllegations={ officerAllegations } />
    );

    againstCard = ReactTestUtils.findRenderedComponentWithType(againstSection, AgainstCard);

    againstCard.should.render([InvestigationTimeline]);
  });
});
