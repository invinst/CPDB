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
});
