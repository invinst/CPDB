var CircleList;
var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');

require('should');
require('utils/tests/should/React');

CircleList = require('components/Shared/OfficerAllegationItem/CircleList.react');

describe('CircleListComponent', function () {
  it('should be renderable', function () {
    CircleList.should.be.renderable();
  });

  it('should render nothing if allegationCountList is empty', function () {
    var circleList = ReactTestUtils.renderIntoDocument(
      <CircleList />
    );
    circleList.should.renderNothing();
  });

  it('should render circle list sorted by descending order of allegation count', function () {
    var allegationCounts = [1, 10, 5];
    var expectedRenderedClasses = ['circle circle-1', 'circle circle-2', 'circle circle-4'];
    var circleList = ReactTestUtils.renderIntoDocument(
      <CircleList allegationCountList={ allegationCounts } />
    );

    var circleDoms = ReactTestUtils.scryRenderedDOMComponentsWithClass(circleList, 'circle');
    var renderedClasses = circleDoms.map(function (circleDom) {
      return circleDom.getAttribute('class');
    });

    renderedClasses.should.be.eql(expectedRenderedClasses);
  });
});
