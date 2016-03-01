var React = require('react');
var PropTypes = React.PropTypes;

var AppConstants = require('constants/AppConstants');
var OutcomeFilterItem = require('components/DataToolPage/ComplaintList/OutcomeFilterItem.react');


var OutcomeFilter = React.createClass({
  propTypes: {
    activeFilter: PropTypes.string,
    callAPI: PropTypes.bool,
    analytics: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
  },

  renderOutcomeFilterItems: function () {
    var activeFilter = this.props.activeFilter;
    var analytics = this.props.analytics;
    var outcomeFilters = [];
    var type, name, quantity;

    for (type in AppConstants.FILTERS) {
      name = AppConstants.FILTERS[type];
      quantity = analytics[name];
      if (quantity) {
        outcomeFilters.push(
          <OutcomeFilterItem
            type={ type }
            key={ type }
            active={ type==activeFilter }
            name={ name }
            quantity={ quantity }
            callAPI={ this.props.callAPI }/>
          );
      }
    }

    return outcomeFilters;
  },

  render: function () {
    return (
      <div className='filters'>
        { this.renderOutcomeFilterItems() }
      </div>
    );
  }
});

module.exports = OutcomeFilter;
