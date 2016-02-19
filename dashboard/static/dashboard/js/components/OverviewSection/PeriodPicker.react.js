var React = require('react');
var PeriodPickerStore = require('../../stores/OverviewSection/PeriodPickerStore');
var PeriodPickerActions = require('../../actions/OverviewSection/PeriodPickerActions');
var AppConstants = require('../../constants/AppConstants');


var PeriodPicker = React.createClass({
  getInitialState: function () {
    return PeriodPickerStore.getState();
  },

  componentDidMount: function () {
    PeriodPickerStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    PeriodPickerStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    this.setState(PeriodPickerStore.getState());
  },

  _onClick: function (period) {
    PeriodPickerActions.setPeriod(period);
  },

  render: function () {
    var periods = [];
    for (var period in AppConstants.PERIODS) {
      var activeClass = period == this.state.period ? 'active' : '';
      periods.push(
        <li key={ period } className={ activeClass } onClick={ this._onClick.bind(this, period) }>
          { AppConstants.PERIODS[period] }
        </li>
      );
    }

    return (
      <ul id='period-picker'>
        { periods }
      </ul>
    );
  }
});

module.exports = PeriodPicker;
