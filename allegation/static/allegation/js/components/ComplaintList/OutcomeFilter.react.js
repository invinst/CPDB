var React = require('react');
var OutcomeFilterItem = require('./OutcomeFilterItem.react');
var OutcomeFilterStore = require('../../stores/ComplaintList/OutcomeFilterStore');
var OutcomeAnalysisAPI = require('../../utils/OutcomeAnalysisAPI');
var AppConstants = require('../../constants/AppConstants');

var OutcomeFilter = React.createClass({
  getInitialState: function() {
    return OutcomeFilterStore.getState();
  },

  componentDidMount: function() {
    OutcomeAnalysisAPI.getAnalysisInformation();
    OutcomeFilterStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    OutcomeFilterStore.removeChangeListener(this._onChange);
  },

  renderOutcomeFilterItems: function() {
    var activeFilter = this.state.activeFilter;
    var analytics = this.state.analytics;
    var outcomeFilters = [];

    for (var type in AppConstants.FILTERS) {
      var name = AppConstants.FILTERS[type];
      var quantity = analytics[name];
      if (quantity != 0) {
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
  },

  _onChange: function () {
    this.setState(OutcomeFilterStore.getState());
  },
});

module.exports = OutcomeFilter;
