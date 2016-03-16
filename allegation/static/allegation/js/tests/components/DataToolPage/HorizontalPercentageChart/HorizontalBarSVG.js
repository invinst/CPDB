var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var ElementUtils = require('test_utils/ElementUtils');
var HorizontalBarSVG = require('components/DataToolPage/HorizontalPercentageChart/HorizontalBarSVG.react');


require('should');

describe('HorizontalBarSVG component', function () {
  var horizontalBarSVG;

  afterEach(function () {
    if (horizontalBarSVG) {
      ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(horizontalBarSVG).parentNode);
    }
  });

  it('should render svg with correct attributes', function () {
    var segments = [
      {
        translateX: 0,
        width: 10,
        fill: 'red'
      },
      {
        translateX: 10,
        width: 90,
        fill: 'blue'
      }
    ];

    horizontalBarSVG = ReactTestUtils.renderIntoDocument(
      <HorizontalBarSVG segments={ segments } totalWidth={ 100 }/>
    );

    ElementUtils.pluckElementsAttribute(horizontalBarSVG, 'rect', 'width').should.deepEqual(['10', '90']);
    ElementUtils.pluckElementsAttribute(horizontalBarSVG, 'rect', 'transform').should.deepEqual([
      'translate(0,0)', 'translate(10,0)'
    ]);
    ElementUtils.pluckElementsAttribute(horizontalBarSVG, 'rect', 'style').should.deepEqual([
      'fill:red;', 'fill:blue;'
    ]);
  });
});
