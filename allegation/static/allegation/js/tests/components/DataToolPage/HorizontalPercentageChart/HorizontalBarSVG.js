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

    ElementUtils.getElementsAttributeByTagName(horizontalBarSVG, 'rect', 'width').should.deepEqual(['10%', '90%']);
    ElementUtils.getElementsAttributeByTagName(horizontalBarSVG, 'rect', 'x').should.deepEqual([
      '0%', '10%'
    ]);
    ElementUtils.getElementsAttributeByTagName(horizontalBarSVG, 'rect', 'style').should.deepEqual([
      'fill:red;', 'fill:blue;'
    ]);
  });

  it('should trigger filter when user click on segment', function () {
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
  });
});
