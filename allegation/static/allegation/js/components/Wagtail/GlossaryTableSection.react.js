var _ = require('lodash');
var React = require('react');
var PropTypes = React.PropTypes;

var GlossaryTableRow = require('components/Wagtail/GlossaryTableRow.react');


var GlossaryTableSection = React.createClass({
  propTypes: {
    rows: PropTypes.array
  },

  renderRows: function () {
    return _.map(this.props.rows, function (row, key) {
      return (
        <GlossaryTableRow value={ row } key={ key } />
      );
    });
  },

  render: function () {
    return (
      <table className='glossary-table table-striped table'>
        <tbody>
          { this.renderRows() }
        </tbody>
      </table>
    );
  }
});

GlossaryTableSection.TYPE = 'glossary_table_section';

module.exports = GlossaryTableSection;
