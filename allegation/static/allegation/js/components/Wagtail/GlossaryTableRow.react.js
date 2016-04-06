var _ = require('lodash');
var classnames = require('classnames');
var React = require('react');
var PropTypes = React.PropTypes;

var CATEGORY_DICT = {
  'complaint_process': {
    name: 'Complaint Process',
    className: 'label-warning'
  },
  'organizational': {
    name: 'Organizational',
    className: 'label-info'
  },
  'outcomes': {
    name: 'Outcomes',
    className: 'label-success'
  },
  'n_a': {
    name: 'n/a',
    className: null
  }
};


var GlossaryTableRow = React.createClass({
  propTypes: {
    value: PropTypes.shape({
      definition: PropTypes.string,
      category: PropTypes.oneOf(_.keys(CATEGORY_DICT)),
      term: PropTypes.string
    })
  },

  render: function () {
    var category = CATEGORY_DICT[this.props.value.category] || {};
    var categoryClass = classnames('label', category.className);
    var categoryCell = category.className ?
      <label className={ categoryClass }>{ category.name }</label> :
      category.name;

    return (
      <tr>
        <td className='term'>
          <strong>
            { this.props.value.term }
          </strong>
        </td>
        <td className='definition'>
          <p>{ this.props.value.definition }</p>
        </td>
        <td className='category'>
          { categoryCell }
        </td>
      </tr>
    );
  }
});

module.exports = GlossaryTableRow;
