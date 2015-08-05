var React = require('react');
var OutcomeFilterItem = require('./OutcomeFilterItem.react');
var OutcomeFilterStore = require('../../stores/ComplaintList/OutcomeFilterStore');
var AppConstants = require('../../constants/AppConstants');

var OutcomeFilter = React.createClass({
  getInitialState: function() {
    return OutcomeFilterStore.getState();
  },

  componentDidMount: function() {
    OutcomeFilterStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    OutcomeFilterStore.removeChangeListener(this._onChange);
  },

  renderOutcomeFilterItems: function() {
    var activeFilter = this.state.activeFilter;
    var outcomeFilters = [];

    for (var type in AppConstants.FILTERS) {
      outcomeFilters.push(<OutcomeFilterItem type={type} active={type==activeFilter} name={AppConstants.FILTERS[type]}/>)
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
