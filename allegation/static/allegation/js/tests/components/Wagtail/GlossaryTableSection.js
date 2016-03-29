var _ = require('lodash');
var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var GlossaryTableSection = require('components/Wagtail/GlossaryTableSection.react');


describe('GlossaryTableSection component', function () {
  var tableSection;

  afterEach(function () {
    if (tableSection) {
      ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(tableSection).parentNode);
    }
  });

  it('should render table content', function () {
    var rows, cells;
    var value = [
      {
        term: 'a',
        definition: 'b',
        category: 'complaint_process'
      },
      {
        term: 'c',
        definition: 'd',
        category: 'organizational'
      },
      {
        term: 'e',
        definition: 'f',
        category: 'outcomes'
      },
      {
        term: 'g',
        definition: 'h',
        category: 'n_a'
      }
    ];

    tableSection = ReactTestUtils.renderIntoDocument(
      <GlossaryTableSection rows={ value } />
    );

    rows = ReactTestUtils.scryRenderedDOMComponentsWithTag(tableSection, 'tr');
    cells = _.map(rows, function (row) {
      return _.pluck(row.getElementsByTagName('td'), 'textContent');
    });

    cells.should.deepEqual([
      ['a', 'b', 'Complaint Process'],
      ['c', 'd', 'Organizational'],
      ['e', 'f', 'Outcomes'],
      ['g', 'h', 'n/a']
    ]);
  });
});
