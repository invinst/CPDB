var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var MapStore = require('../stores/MapStore');
var FilterStore = require('../stores/FilterStore');
var SummaryStore = require('../stores/SummaryStore');
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
    var filters = FilterStore.getAll();
    if ('cat' in filters) {
      var category = this.props.category;
      for (var i = 0; i < filters['cat'].value.length; i++) {
        for (var j = 0; j < category.subcategories.length; j++) {
          var childCategoryName = category.subcategories[j].cat_id;
          if (filters['cat'].value[i].indexOf(childCategoryName) > -1) {
            return true;
          }
        }
      }
    }
    return false;
  },
  isActive: function (category){
    var filters = FilterStore.getAll();
    return 'cat__category' in filters && filters['cat__category'].value.indexOf(category.name) > -1
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
    var arrow = "";
    if (this.isActive(category)) {
      className += " active";
    }

    // Currently do nothing but keep it here for later styling
    if (this.hasActiveChildren()) {
    }

    if (this.props.isCurrentActive) {
      arrow = (
        <div className='arrow-container'>
          <i className='fa fa-caret-left fa-2x'></i>
        </div>
      )
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
            <div className='col-md-10 relative'>
              {arrow}
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

    if (this.isActive(current)) {
      FilterStore.tagsInputRemoveItemObject(current.tagValue);
    } else {
      $('#cpdb-search').tagsinput("add", current.tagValue);
    }

    SummaryStore.setCurrentActive(current.name)

    $(".child-rows.active").removeClass('active');
    $("#child-rows-" + current.id).addClass('active');
  }
});

module.exports = SummaryRow;
