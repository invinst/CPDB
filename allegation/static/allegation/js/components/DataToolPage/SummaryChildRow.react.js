var React = require('react');
var PropTypes = React.PropTypes;

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
  propTypes: {
    category: PropTypes.object,
    subcategory: PropTypes.object,
    summary: PropTypes.object
  },

  getInitialState: function () {
    return getChildRowState();
  },

  onClick: function (e) {
    e.preventDefault();

    var parent = this.props.category;
    FilterTagsActions.removeTag('cat__category', parent.name);

    var child = this.props.subcategory;
    // Generate tagValue on server instead
    var tagValue = FilterTagStore.generateTagValue('cat', child.id, 'Allegation type', child.name);

    if (this.state.selected) {
      FilterTagsActions.removeTag(tagValue.category, tagValue.value);
    } else {
      FilterTagsActions.addTag(tagValue);
    }

    this.setState({
      selected : !this.state.selected
    });
  },

  isActive: function () {
    var catId = this.props.subcategory.id;
    var selectedCategories = this.props.summary.props.selectedCategories;

    return (
      !!FilterTagStore.getFilter('cat', catId)
      || !!FilterTagStore.getFilter('cat__category', this.props.category.name)
      || (selectedCategories && selectedCategories.indexOf(catId) > -1)
    );
  },

  render: function () {
    var className = 'category-name';

    if (this.isActive()) {
      className += ' active';
    }

    return (
      <div className='row summary-child-row'>
        <div className='col-md-2 col-xs-2 count'>
          { numeral(this.props.subcategory.count).format(AppConstants.NUMERAL_FORMAT) }
        </div>
        <div className='col-md-10 col-xs-10 category-name-wrapper'>
          <a href='javascript:void()'
            className={ className } onClick={ this.onClick }>
            { this.props.subcategory.name }
          </a>
        </div>
      </div>
    );
  }
});

module.exports = SummaryChildRow;
