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
  hasActiveChildren: function (filters) {
    var category = this.props.category;
    for (var i = 0; i < filters['cat'].value.length; i++) {
      for (var j = 0; j < category.subcategories.length; j++) {
        var childCategoryName = category.subcategories[j].cat_id;
        if (filters['cat'].value[i].indexOf(childCategoryName) > -1) {
         return true;
        }
      }
    }
    return false;
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
    var parentClassName = 'row';
    var filters = FilterStore.getAll();
    if ('cat__category' in filters && filters['cat__category'].value.indexOf(category.name) > -1) {
      className += " active";
    }
    if ('cat' in filters && this.hasActiveChildren(filters)) {
      parentClassName += ' child-active';
    }
    return (
      <div className="row category main-category">
        <div className='col-md-6'>
          <div className="progress complaint" style={progressStyle}>
            <div className="progress-bar discipline" role="progressbar" aria-valuenow="60" aria-valuemin="0"
                 aria-valuemax="100" style={style}>
              <span className="sr-only"></span>
            </div>
          </div>
        </div>
        <div className='col-md-6'>
          <div className={parentClassName}>
            <div className='col-md-2'>
              {category.total}
            </div>
            <div className='col-md-10'>
              <a onClickCapture={this.onClick} href='#' className={className}>{category.name}</a>
            </div>
          </div>
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
