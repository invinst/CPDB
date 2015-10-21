var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('components/DataToolPage/Filters.react');
var MapStore = require('stores/MapStore');
var SummaryActions = require('actions/SummaryActions');
var FilterTagsActions = require('actions/FilterTagsActions');
var FilterStore = require('stores/FilterStore');
var AppConstants = require('constants/AppConstants');
var numeral = require('numeral');

function getChildRowState() {
  return {
    selected: false
  };
}

var SummaryChildRow = React.createClass({
  getInitialState: function () {
    return getChildRowState();
  },
  onClick: function (e) {
    e.preventDefault();

    var parent = this.props.category
    FilterTagsActions.removeTag('cat__category', {label: parent.name, value: parent.name});

    var child = this.props.subcategory;
    if (this.state.selected) {
      FilterTagsActions.removeTag('cat', {label: child.name, value: child.cat_id});
    } else {
      FilterTagsActions.addTag('cat', {label: child.name, value: child.cat_id});
    }

    this.state.selected = !this.state.selected;
  },

  isActive: function () {
    var filters = FilterStore.getAll();
    var catId = this.props.subcategory.cat_id;
    var selectedCategories = this.props.summary.props.selectedCategories;
    return (
      ('cat' in filters && filters['cat'].value.indexOf(catId) > -1)
      || ('cat__category' in filters && filters['cat__category'].value.indexOf(this.props.category.name) > -1)
      || (selectedCategories && selectedCategories.indexOf(catId) > -1)
    );
  },

  render: function () {
    var className = "category-name";

    if (this.isActive()) {
      className += " active";
    }

    return (
      <div className="row summary-child-row">
        <div className="col-md-2 count">
          {numeral(this.props.subcategory.count).format(AppConstants.NUMERAL_FORMAT)}
        </div>
        <div className="col-md-10 category-name-wrapper">
          <a href="javascript:void()" className={className} onClick={this.onClick}>{this.props.subcategory.name}</a>
        </div>
      </div>
    );
  }
});

module.exports = SummaryChildRow;
