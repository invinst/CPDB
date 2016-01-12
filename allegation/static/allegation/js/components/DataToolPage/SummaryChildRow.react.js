var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('components/DataToolPage/Filters.react');
var MapStore = require('stores/MapStore');
var SummaryActions = require('actions/SummaryActions');
var FilterTagsActions = require('actions/FilterTagsActions');
var FilterTagStore = require('stores/FilterTagStore');
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
    FilterTagsActions.removeTag('Category', parent.name);

    var child = this.props.subcategory;
    if (this.state.selected) {
      FilterTagsActions.removeTag('Category ID', child.cat_id);
    } else {
      FilterTagsActions.addTag('Category ID', child.cat_id, 'cat__cat_id=' + child.cat_id, child.name);
    }

    this.state.selected = !this.state.selected;
  },

  isActive: function () {
    var filters = FilterTagStore.getAll();
    var catId = this.props.subcategory.cat_id;
    var selectedCategories = this.props.summary.props.selectedCategories;
    return (
      ('cat' in filters && filters['cat'].value.indexOf(id) > -1)
      || ('cat__category' in filters && filters['cat__category'].value.indexOf(this.props.category.name) > -1)
      || (selectedCategories && selectedCategories.indexOf(id) > -1)
    );
  },

  render: function () {
    var className = "category-name";

    if (this.isActive()) {
      className += " active";
    }

    return (
      <div className="row summary-child-row">
        <div className="col-md-2 col-xs-2 count">
          {numeral(this.props.subcategory.count).format(AppConstants.NUMERAL_FORMAT)}
        </div>
        <div className="col-md-10 col-xs-10 category-name-wrapper">
          <a href="javascript:void()" className={className} onClick={this.onClick}>{this.props.subcategory.name}</a>
        </div>
      </div>
    );
  }
});

module.exports = SummaryChildRow;
