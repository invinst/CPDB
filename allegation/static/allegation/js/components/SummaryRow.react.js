var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var MapStore = require('../stores/MapStore');
var FilterStore = require('../stores/FilterStore');
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
    var className = "category-name";
    var filters = FilterStore.getAll();
    if ('cat__category' in filters && filters['cat__category'].value.indexOf(category.name) > -1) {
      className += " active";
    }
    return (
      <div className='row category main-category'>
        <div className='col-md-6'>
          <div className="progress complaint" style={progressStyle}>
            <div className="progress-bar discipline" role="progressbar" aria-valuenow="60" aria-valuemin="0"
                 aria-valuemax="100" style={style}>
              <span className="sr-only"></span>
            </div>
          </div>
        </div>
        <div className='col-md-1'>
          {category.total}
        </div>
        <div className='col-md-5'>
          <a onClickCapture={this.onClick} href='#' className={className}>{category.name}</a>
        </div>
      </div>
    );

  },
  onClick: function (e) {
    e.preventDefault();
    var current = this.props.category;
    $('#cpdb-search').tagsinput("add", current.tagValue);

    //SummaryActions.setSummary(current);

    $(".child-rows.active").removeClass('active');
    $("#child-rows-" + current.id).addClass('active');
  }
});

module.exports = SummaryRow;
