var OfficerCard, ReactTestUtils;

var React = require('react');
require('react-dom');
ReactTestUtils = require('react-addons-test-utils');

require('should');

OfficerCard = require('components/Shared/OfficerCard.react');


describe('officerCard component', function () {
  var officerCard;

  it('should be renderable', function () {
    officerCard = ReactTestUtils.renderIntoDocument(
      <OfficerCard />
    );

    officerCard.should.be.ok;
  });

  it('should display officer name information', function () {
    var displayName = 'test name';

    officerCard = ReactTestUtils.renderIntoDocument(
      <OfficerCard displayName={ displayName } />
    );

    ReactTestUtils.findRenderedDOMComponentWithClass(officerCard, 'name bold')
      .textContent.should.be.containEql(displayName);
  });

  it('should display officer description information', function () {
    var description = 'test description';

    officerCard = ReactTestUtils.renderIntoDocument(
      <OfficerCard description={ description } />
    );

    ReactTestUtils.findRenderedDOMComponentWithClass(officerCard, 'description')
      .textContent.should.be.containEql(description);
  });

  it('should render color circle which show how dangerous an officer is', function () {
    officerCard = ReactTestUtils.renderIntoDocument(
      <OfficerCard />
    );

    ReactTestUtils.findRenderedDOMComponentWithClass(officerCard, 'circle').should.be.ok;
  });

});
