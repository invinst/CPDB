var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var sinon = require('sinon');

var ElementUtils = require('test_utils/ElementUtils');
var DOMUtils = require('utils/DOMUtils');
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
        percent: 80
      },
      {
        label: 'b',
        percent: 20
      }
    ];

    labelBar = ReactTestUtils.renderIntoDocument(
      <LabelBar segments={ segments }/>
    );

    ElementUtils.getElementsTextByClassName(labelBar, 'segment-name').should.deepEqual(['a', 'b']);

    ElementUtils.getElementsTextByClassName(labelBar, 'segment-percentage').should.deepEqual(['80%', '20%']);
  });

  it('should calculate correct style.left', function () {
    var leftFunc = LabelBar.calculateLeft(8, 'a', 'b', 100);

    sinon.stub(DOMUtils, 'getTextWidth', function (text, font) {
      return 2;
    });

    leftFunc({width: 0}).should.equal(0);
    leftFunc({width: 22}).should.equal(10);
    leftFunc({width: 4}).should.equal(22);
    DOMUtils.getTextWidth.restore();
  });
});
