var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var ElementUtils = require('test_utils/ElementUtils');
var LabelBar = require('components/DataToolPage/HorizontalPercentageChart/LabelBar.react');

require('should');


describe('LabelBar component', function () {
  var labelBar;

  afterEach(function () {
    if (labelBar) {
      ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(labelBar).parentNode);
      labelBar = null;
    }
  });

  it('should render correct label and percent', function () {
    var segments = [
      {
        label: 'a',
        percent: 80,
        active: true
      },
      {
        label: 'b',
        percent: 20,
        active: false
      }
    ];

    labelBar = ReactTestUtils.renderIntoDocument(
      <LabelBar segments={ segments }/>
    );

    ElementUtils.getElementsTextByClassName(labelBar, 'segment-name').should.deepEqual(['a', 'b']);

    ElementUtils.getElementsTextByClassName(labelBar, 'segment-percentage').should.deepEqual(['80%', '20%']);

    ReactTestUtils.scryRenderedDOMComponentsWithClass(labelBar, 'active').length.should.equal(1);
  });

  it('should calculate correct style.left', function () {
    var leftFunc = LabelBar.calculateLeft();

    leftFunc({width: 10}).should.equal(0);
    leftFunc({width: 22}).should.equal(10);
    leftFunc({width: 4}).should.equal(32);
  });
});
