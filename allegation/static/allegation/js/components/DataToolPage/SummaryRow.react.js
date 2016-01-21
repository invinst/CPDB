var _ = require('lodash');
var React = require('react');
var classnames = require('classnames');

var MapStore = require('stores/MapStore');
var FilterTagsActions = require('actions/FilterTagsActions');
var FilterTagStore = require('stores/FilterTagStore');
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
    var filters = FilterTagStore.getAll();
    var category = this.props.category;

    for (var i = 0; i < category.subcategories.length; i++) {
      childCategoryName = category.subcategories[i].name
      if (FilterTagStore.getFilter('Allegation type', childCategoryName)) {
        return true;
      }
    }
    return false;
  },

  isActive: function (category){
    var selectedCategories = this.props.summary.props.selectedCategories;
    if (selectedCategories) {
      return selectedCategories.indexOf(category.name) > -1;
    }
    var filters = FilterTagStore.getAll();
    return !!FilterTagStore.getFilter('Category', category.name);
  },

  render: function () {
    var category = this.props.category;
    var style = {
      width: (category.count / category.total * 100) + "%"
    };
    var progressStyle = {
      width: category.percentToMax + "%"
    };
    var className = classnames("category-name", {
      'active': this.isActive(category) || this.hasActiveChildren()
    });
    var mainCategoryClassName = classnames('col-md-7 col-xs-7 main-category-name-wrapper', {
      'active': this.props.isCurrentActive
    });
    var arrow = "";

    if (this.props.isCurrentActive) {
      arrow = (
        <div className='arrow-container'>
          <i className='fa fa-caret-left fa-28px'></i>
        </div>
      )
    }

    return (
      <div className="row category main-category" onClickCapture={this.onClick}>
        <div className='col-md-5 col-xs-5'>
          <div className="progress complaint" style={progressStyle}>
            <div className="progress-bar discipline" role="progressbar" aria-valuenow="60" aria-valuemin="0"
                 aria-valuemax="100" style={style}>
              <span className="sr-only"></span>
            </div>
          </div>
        </div>
        <div className={mainCategoryClassName}>
          <div className="row">
            <div className='col-md-2 col-xs-2 category-anlytics'>
              <span className='count'>{numeral(category.count).format(AppConstants.NUMERAL_FORMAT)}</span>
            </div>
            <div className='col-md-2 col-xs-2 category-anlytics'>
              <span className='total'>{numeral(category.total).format(AppConstants.NUMERAL_FORMAT)}</span>
            </div>
            <div className='col-md-8 col-xs-8 relative category-name-wrapper'>
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

    FilterTagsActions.removeCategory('Allegation type');

    if (this.isActive(current)) {
      FilterTagsActions.removeTag('Category', current.name);
    } else {
      FilterTagsActions.addTag('Category', current.name, 'cat__category=' + current.name, current.name);
    }

    SummaryStore.setCurrentActive(current.name);

    $(".child-rows.active").removeClass('active');
    $("#child-rows-" + current.id).addClass('active');
  }
});

module.exports = SummaryRow;
