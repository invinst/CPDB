var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var MapStore = require('../stores/MapStore');
var SummaryActions = require('../actions/SummaryActions');

function getSummaryRowState() {
  return {
    'rows': []
  }
}

var SummaryRow = React.createClass({
  getInitialState: function () {
    return getSummaryRowState();
  },
  render: function () {
    var category = this.props.category;
    var style = {
      width: (category.count / category.total * 100) + "%"
    };
    var progressStyle = {
      width: category.percentToMax + "%"
    };

    return <div className='row'>
      <div className='col-md-5'>
        <div className="progress complaint" style={progressStyle}>
          <div className="progress-bar discipline" role="progressbar" aria-valuenow="60" aria-valuemin="0"
               aria-valuemax="100" style={style}>
            <span className="sr-only"></span>
          </div>
        </div>
      </div>
      <div className='col-md-1'>
        {category.count}
      </div>
      <div className='col-md-1'>
        {category.total}
      </div>
      <div className='col-md-5 '>
        <a onClickCapture={this.onClick} href='#' className="category-name">{category.name}</a>
      </div>
    </div>

  },
  onClick: function (e) {
    e.preventDefault();
    var current = this.props.category;
    $('#cpdb-search').tagsinput("add", current.tagValue);

    SummaryActions.setSummary(current);
  }
});

module.exports = SummaryRow;
