var React = require('react');
var PropTypes = React.PropTypes;
var classnames = require('classnames');

var FilterTagsActions = require('actions/FilterTagsActions');
var FilterTagStore = require('stores/FilterTagStore');
var SummaryStore = require('stores/SummaryStore');
var AppConstants = require('constants/AppConstants');
var numeral = require('numeral');

var getSummaryRowState = function () {
  return {
    'rows': []
  };
};


var SummaryRow = React.createClass({
  propTypes: {
    category: PropTypes.object,
    summary: PropTypes.object,
    isCurrentActive: PropTypes.bool
  },

  getInitialState: function () {
    return getSummaryRowState();
  },

  componentDidMount: function () {
    if (this.props.category.name == this.props.summary.props.currentActive) {
      this.onClick();
    }
  },

  onClick: function (e) {
    var current,
      tagValue;

    if (e) {
      e.preventDefault();
    }

    current = this.props.category;

    FilterTagsActions.removeCategory('cat');
    // Generate tagValue on server instead
    tagValue = FilterTagStore.generateTagValue('cat__category', current.name, 'Category', current.name);

    if (this.isActive(current)) {
      FilterTagsActions.removeTag(tagValue.category, tagValue.value);
    } else {
      FilterTagsActions.addTag(tagValue);
    }

    SummaryStore.setCurrentActive(current.name);

    $('.child-rows.active').removeClass('active');
    $('#child-rows-' + current.id).addClass('active');
  },

  hasActiveChildren: function () {
    var category = this.props.category, childCategoryId;
    var i;

    for (i = 0; i < category.subcategories.length; i++) {
      childCategoryId = category.subcategories[i].id;
      if (FilterTagStore.getFilter('cat', childCategoryId)) {
        return true;
      }
    }
    return false;
  },

  isActive: function (category) {
    var selectedCategories = this.props.summary.props.selectedCategories;
    if (selectedCategories) {
      return selectedCategories.indexOf(category.name) > -1;
    }

    return !!FilterTagStore.getFilter('cat__category', category.name);
  },

  render: function () {
    var category = this.props.category;
    var style = {
      width: (category.count / category.total * 100) + '%'
    };
    var progressStyle = {
      width: category.percentToMax + '%'
    };
    var className = classnames('category-name', {
      'active': this.isActive(category) || this.hasActiveChildren()
    });
    var mainCategoryClassName = classnames('col-md-7 col-xs-7 main-category-name-wrapper', {
      'active': this.props.isCurrentActive
    });
    var arrow = '';

    if (this.props.isCurrentActive) {
      arrow = (
        <div className='arrow-container'>
          <i className='fa fa-caret-left fa-28px'></i>
        </div>
      );
    }

    return (
      <div className='row category main-category' onClickCapture={ this.onClick }>
        <div className='col-md-5 col-xs-5'>
          <div className='progress complaint' style={ progressStyle }>
            <div className='progress-bar discipline' role='progressbar' aria-valuenow='60' aria-valuemin='0'
              aria-valuemax='100' style={ style }>
              <span className='sr-only'></span>
            </div>
          </div>
        </div>
        <div className={ mainCategoryClassName }>
          <div className='row'>
            <div className='col-md-2 col-xs-2 category-anlytics'>
              <span className='count'>{ numeral(category.count).format(AppConstants.NUMERAL_FORMAT) }</span>
            </div>
            <div className='col-md-2 col-xs-2 category-anlytics'>
              <span className='total'>{ numeral(category.total).format(AppConstants.NUMERAL_FORMAT) }</span>
            </div>
            <div className='col-md-8 col-xs-8 relative category-name-wrapper'>
              { arrow }
              <a href='javascript:void()' className={ className }>{ category.name }</a>
            </div>
          </div>
        </div>
      </div>
    );

  }
});

module.exports = SummaryRow;
