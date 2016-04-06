var _ = require('lodash');
var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var RowSection = require('components/Wagtail/RowSection.react');


describe('RowSection component', function () {
  var rowSection;

  afterEach(function () {
    if (rowSection) {
      ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(rowSection).parentNode);
    }
  });

  it('should render row content', function () {
    var halfColumns;
    var rowData = {
      value: [
        {
          type: RowSection.COL_TYPE.half,
          value: 'b'
        },
        {
          type: RowSection.COL_TYPE.half,
          value: 'c'
        },
        {
          type: RowSection.COL_TYPE.full,
          value: 'd'
        }
      ]
    };

    rowSection = ReactTestUtils.renderIntoDocument(
      <RowSection paragraphs={ rowData.value }/>
    );

    halfColumns = ReactTestUtils.scryRenderedDOMComponentsWithClass(rowSection ,'col-md-6');
    _.pluck(halfColumns, 'textContent').should.deepEqual(['b','c']);

    ReactTestUtils.findRenderedDOMComponentWithClass(rowSection, 'col-md-12')
      .textContent.should.equal('d');
  });
});
