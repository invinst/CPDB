var React = require('react');
var PropTypes = React.PropTypes;
var _ = require('lodash');
var S = require('string');

var HorizontalPercentageChart = require('components/DataToolPage/HorizontalPercentageChart.react');
var RaceGenderAgeTabStore = require('stores/DataToolPage/RaceGenderAgeTabStore');

var OFFICER_ROLE = 'Officer';
var COMPLAINANT_ROLE = 'Complainant';


var RaceGenderAgeTab = React.createClass({
  propTypes: {
    role: PropTypes.oneOf([OFFICER_ROLE, COMPLAINANT_ROLE])
  },

  getInitialState: function () {
    return this._getNewState();
  },

  componentDidMount: function () {
    RaceGenderAgeTabStore.addChangeListener(this._onChange);
    this._onChange();
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return !_.isEqual(this.state, nextState) || !_.isEqual(this.props, nextProps);
  },

  componentWillUnmount: function () {
    RaceGenderAgeTabStore.removeChangeListener(this._onChange);
  },

  dataMethods: {
    age: S('get{{role}}AgeSegments'),
    gender: S('get{{role}}GenderSegments'),
    race: S('get{{role}}RaceSegments')
  },

  _getNewState: function () {
    var newState = {};
    var self = this;
    _.each(this.dataMethods, function (val, key) {
      var method = val.template({ role: self.props.role }).s;
      newState[key] = RaceGenderAgeTabStore[method]();
    });
    return newState;
  },

  _onChange: function () {
    this.setState(this._getNewState());
  },

  render: function () {
    return (
      <div className='race-gender-age-tab'>
        <HorizontalPercentageChart
          className='race' label='Race' data={ this.state.race }
          category='' filter=''/>
        <HorizontalPercentageChart
          className='gender' label='Gender' data={ this.state.gender } />
        <HorizontalPercentageChart
          className='age' label='Age' data={ this.state.age } />
      </div>
    );
  }
});

RaceGenderAgeTab.OFFICER_ROLE = OFFICER_ROLE;
RaceGenderAgeTab.COMPLAINANT_ROLE = COMPLAINANT_ROLE;

module.exports = RaceGenderAgeTab;
