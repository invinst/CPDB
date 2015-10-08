var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('components/HomePage/Filters.react');
var MapStore = require('stores/MapStore');
var FilterStore = require('stores/FilterStore');
var SummaryStore = require('stores/SummaryStore');
var SummaryActions = require('actions/SummaryActions');
var AppConstants = require('constants/AppConstants');
var numeral = require('numeral');

function getSummaryRowState() {
  return {
    'rows': []
  }
}

var SummaryRow = React.createClass({
  getInitialState: function () {
    return getSummaryRowState();
  },

  componentDidMount: function () {
    if (this.props.category.name == this.props.summary.props.currentActive) {
      this.onClick();
    }
  },

  hasActiveChildren: function () {
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
    var selectedCategories = this.props.summary.props.selectedCategories;
    if (selectedCategories) {
      return selectedCategories.indexOf(category.name) > -1;
    }
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
    var mainCategoryClassName = 'col-md-7 main-category-name-wrapper'
    var arrow = "";
    if (this.isActive(category)) {

      className += " active";
    }

    // Currently do nothing but keep it here for later styling
    if (this.hasActiveChildren()) {
      className += " active";
    }

    if (this.props.isCurrentActive) {
      mainCategoryClassName += ' active';
      arrow = (
        <div className='arrow-container'>
          <i className='fa fa-caret-left fa-28px'></i>
        </div>
      )
    }

    return (
      <div className="row category main-category" onClickCapture={this.onClick}>
        <div className='col-md-5'>
          <div className="progress complaint" style={progressStyle}>
            <div className="progress-bar discipline" role="progressbar" aria-valuenow="60" aria-valuemin="0"
                 aria-valuemax="100" style={style}>
              <span className="sr-only"></span>
            </div>
          </div>
        </div>
        <div className={mainCategoryClassName}>
          <div className={parentClassName}>
            <div className='col-md-2 category-anlytics'>
              <span className='count'>{numeral(category.count).format(AppConstants.NUMERAL_FORMAT)}</span>
            </div>
            <div className='col-md-2 category-anlytics'>
              <span className='total'>{numeral(category.total).format(AppConstants.NUMERAL_FORMAT)}</span>
            </div>
            <div className='col-md-8 relative category-name-wrapper'>
              {arrow}
              <a href='javascript:void()' className={className}>{category.name}</a>
            </div>
          </div>
        </div>
      </div>
    );

  },
  onClick: function (e) {
    if (e) {
      e.preventDefault();
    }

    var current = this.props.category;

    if (this.isActive(current)) {
      FilterStore.tagsInputRemoveItemObject(current.tagValue);
    } else {
      $('#cpdb-search').tagsinput("add", current.tagValue);
    }

    SummaryStore.setCurrentActive(current.name);

    $(".child-rows.active").removeClass('active');
    $("#child-rows-" + current.id).addClass('active');
  }
});

module.exports = SummaryRow;
