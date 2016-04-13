/*eslint "react/no-danger":0*/
var _ = require('lodash');
var classnames = require('classnames');
var React = require('react');
var PropTypes = React.PropTypes;

var COL_TYPE = {
  half: 'half_paragraph',
  full: 'full_paragraph'
};


var RowSection = React.createClass({
  propTypes: {
    paragraphs: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.oneOf(_.values(COL_TYPE)),
      value: PropTypes.string
    }))
  },
  render: function () {
    var rowContent = _.map(this.props.paragraphs, function (col, key) {
      var colClassName = classnames({
        'col-md-6': col.type == COL_TYPE.half,
        'col-md-12': col.type == COL_TYPE.full
      });

      return (
        <div key={ key } className={ colClassName } dangerouslySetInnerHTML={ { __html: col.value } } />
      );
    });

    return (
      <div className='row section'>
        <div className='container'>
          { rowContent }
        </div>
      </div>
    );
  }
});

RowSection.COL_TYPE = COL_TYPE;
RowSection.TYPE = 'row_section';

module.exports = RowSection;
