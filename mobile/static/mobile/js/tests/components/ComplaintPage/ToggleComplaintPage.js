var f, ToggleComplaintPage, OfficerAllegationItem, ComplaintPageActions;
var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var sinon = require('sinon');
require('should');

f = require('utils/tests/f');
require('utils/tests/should/React');

ToggleComplaintPage = require('components/ComplaintPage/ToggleComplaintPage.react');
OfficerAllegationItem = require('components/ComplaintPage/ToggleComplaintPage/OfficerAllegationItem.react');
ComplaintPageActions = require('actions/ComplaintPage/ComplaintPageActions');


describe('ToggleComplaintPageComponent', function () {
  it('should be renderable', function () {
    ToggleComplaintPage.should.be.renderable();
  });

  it('should render `OfficerAllegationItem` as sub-component', function () {
    var officerAllegations = f.createBatch(2, 'OfficerAllegation');

    var toggleComplaintPage = ReactTestUtils.renderIntoDocument(
      <ToggleComplaintPage officerAllegations={ officerAllegations } />
    );

    toggleComplaintPage.should.render([OfficerAllegationItem]);
  });

  it('should render `OfficerAllegationItem` with correct officer allegation group', function () {
    var cat1= f.create('Category', {'id': 123});
    var cat2 = f.create('Category', {'id': 456});
    var officerAllegations = f.createBatch(2, 'OfficerAllegation', {'cat': cat1});
    var otherOfficerAllegations = f.createBatch(1, 'OfficerAllegation', {'cat': cat2});

    var toggleComplaintPage = ReactTestUtils.renderIntoDocument(
      <ToggleComplaintPage officerAllegations={ officerAllegations.concat(otherOfficerAllegations) } />
    );

    ReactTestUtils.scryRenderedComponentsWithType(toggleComplaintPage, OfficerAllegationItem).should.have.length(2);
  });

  it('should trigger close action if clicking on close icon', function () {
    var node, toggleComplaintPage;
    var officerAllegations = f.createBatch(1, 'OfficerAllegation');

    var mock = sinon.mock(ComplaintPageActions);
    mock.expects('toggleClose').once().returns(null);

    toggleComplaintPage = ReactTestUtils.renderIntoDocument(
      <ToggleComplaintPage officerAllegations={ officerAllegations } />
    );

    node = ReactTestUtils.findRenderedDOMComponentWithClass(toggleComplaintPage, 'icon-close')
    ReactTestUtils.Simulate.click(node);

    mock.verify();
    mock.restore();
  });
});
