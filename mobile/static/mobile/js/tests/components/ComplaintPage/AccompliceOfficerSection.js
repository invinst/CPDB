var AccompliceOfficerSection, OfficerCard, AppHistory, f;

var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var sinon = require('sinon');
require('should');

f = require('utils/tests/f');
require('utils/tests/should/React');

AccompliceOfficerSection = require('components/ComplaintPage/AccompliceOfficerSection.react');
OfficerCard = require('components/Shared/OfficerCard.react');
AppHistory = require('utils/History');


describe('AccompliceOfficerSectionComponent', function () {
  var accompliceOfficerSection;

  it('should be renderable', function () {
    AccompliceOfficerSection.should.be.renderable();
  });

  it('should be render OfficerCard as sub-component', function () {
    var officerAllegations = f.createBatch(2, 'OfficerAllegation');

    accompliceOfficerSection = ReactTestUtils.renderIntoDocument(
      <AccompliceOfficerSection officerAllegations={ officerAllegations } />
    );

    ReactTestUtils.scryRenderedComponentsWithType(accompliceOfficerSection, OfficerCard).length.should.be.equal(2);
  });

  it('should show officer name, description if any', function () {
    var component;
    var officer = f.create('Officer', {
      'gender': 'M',
      'race': 'Black',
      'officer_first': 'John',
      'officer_last': 'Henry'
    });
    var displayName = 'John Henry';
    var description = 'Male (Black)';
    var officerAllegation = f.create('OfficerAllegation', {'officer': officer});

    accompliceOfficerSection = ReactTestUtils.renderIntoDocument(
      <AccompliceOfficerSection officerAllegations={ [officerAllegation] } />
    );

    component = ReactTestUtils.findRenderedDOMComponentWithClass(accompliceOfficerSection,
      'accomplice-officer-section');
    component.textContent.should.containEql(displayName);
    component.textContent.should.containEql(description);
  });

  it('should show `Gender unknown` and `Race unknown` if they are empty', function () {
    var component;
    var officer = f.create('Officer', {
      'gender': '',
      'race': ''
    });
    var officerAllegation = f.create('OfficerAllegation', {'officer': officer});

    accompliceOfficerSection = ReactTestUtils.renderIntoDocument(
      <AccompliceOfficerSection officerAllegations={ [officerAllegation] } />
    );

    component = ReactTestUtils.findRenderedDOMComponentWithClass(accompliceOfficerSection,
      'accomplice-officer-section');
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

    accompliceOfficerSection = ReactTestUtils.renderIntoDocument(
      <AccompliceOfficerSection officerAllegations={ [officerAllegation] } />
    );

    OfficerNode = ReactTestUtils.scryRenderedComponentsWithType(accompliceOfficerSection, OfficerCard)[0];

    ReactTestUtils.Simulate.click(ReactDOM.findDOMNode(OfficerNode));

    mock.verify();
    mock.restore();
  });

  it('should be hidden when there\'s no officer allegations', function () {
    accompliceOfficerSection = ReactTestUtils.renderIntoDocument(
      <AccompliceOfficerSection />
    );

    accompliceOfficerSection.should.renderNothing();
  });
});
