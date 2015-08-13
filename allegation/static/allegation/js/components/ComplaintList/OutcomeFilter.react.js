var React = require('react');
var OutcomeFilterItem = require('./OutcomeFilterItem.react');
var OutcomeAnalysisAPI = require('../../utils/OutcomeAnalysisAPI');
var AppConstants = require('../../constants/AppConstants');

var OutcomeFilter = React.createClass({
  componentDidMount: function() {
     OutcomeAnalysisAPI.getAnalysisInformation();
  },

  renderOutcomeFilterItems: function() {
    var activeFilter = this.props.activeFilter;
    var analytics = this.props.analytics;
    var outcomeFilters = [];

    for (var type in AppConstants.FILTERS) {
      var name = AppConstants.FILTERS[type];
      var quantity = analytics[name];
      if (quantity) {
        outcomeFilters.push(<OutcomeFilterItem type={type} active={type==activeFilter} name={name} quantity={quantity}/>)
      }
    }

    return outcomeFilters;
  },

  render: function() {
    return (
      <div className='filters'>
        { this.renderOutcomeFilterItems() }
      </div>
    )
  }
});

module.exports = OutcomeFilter;
