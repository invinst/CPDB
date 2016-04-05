var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = React.PropTypes;
var _ = require('lodash');
var S = require('string');

var HorizontalPercentageChart = require('components/DataToolPage/HorizontalPercentageChart.react');
var RaceGenderAgeTabStore = require('stores/DataToolPage/RaceGenderAgeTabStore');
var AllegationFilterTagsQueryBuilder = require('utils/querybuilders/AllegationFilterTagsQueryBuilder');

var RaceGenderAgeTab;
var OFFICER_ROLE = 'Officer';
var COMPLAINANT_ROLE = 'Complainant';
var CATEGORY_DICT = {};
CATEGORY_DICT[OFFICER_ROLE] = {
  race: {
    value: 'officer__race',
    displayValue: 'Officer Race'
  },
  gender: {
    value: 'officer__gender',
    displayValue: 'Officer Gender'
  },
  age: {
    value: 'officer_age',
    displayValue: 'Officer Age'
  }
};
CATEGORY_DICT[COMPLAINANT_ROLE] = {
  race: {
    value: 'complainant_race',
    displayValue: 'Complainant Race'
  },
  gender: {
    value: 'complainant_gender',
    displayValue: 'Complainant Gender'
  },
  age: {
    value: 'complainant_age',
    displayValue: 'Complainant Age'
  }
};


RaceGenderAgeTab = React.createClass({
  propTypes: {
    role: PropTypes.oneOf([OFFICER_ROLE, COMPLAINANT_ROLE]),
    initTab: PropTypes.func
  },

  getDefaultProps: function () {
    return {
      initTab: function () {}
    };
  },

  getInitialState: function () {
    return this._getNewState();
  },

  componentDidMount: function () {
    RaceGenderAgeTabStore.addChangeListener(this._onChange);
    this._onChange();
    this.props.initTab(this);
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

  getEmbedCode: function () {
    var node = ReactDOM.findDOMNode(this);
    var width = $(node).outerWidth();
    var height = $(node).outerHeight();
    var query = encodeURIComponent(AllegationFilterTagsQueryBuilder.buildQuery());
    var src = S('{{base}}/embed/?page={{page}}{{query}}').template({
      base: location.origin,
      page: this.props.role.toLowerCase() + '-race-gender-age-tab',
      query: query ? '&query=' + query : ''
    }).s;
    return '<iframe width="' + width + 'px" height="' + height + 'px" frameborder="0" src="' + src
       + '"></iframe>';
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

  pluralize: function (str) {
    return str + 's';
  },

  render: function () {
    return (
      <div className='race-gender-age-tab' ref='raceGenderChart'>
        <div className='title'>{ this.pluralize(this.props.role) }</div>
        <HorizontalPercentageChart className='race' label='Race'
          category={ CATEGORY_DICT[this.props.role]['race']['value'] }
          displayCategory={ CATEGORY_DICT[this.props.role]['race']['displayValue'] }
          data={ this.state.race }/>
        <HorizontalPercentageChart className='gender' label='Gender'
          category={ CATEGORY_DICT[this.props.role]['gender']['value'] }
          displayCategory={ CATEGORY_DICT[this.props.role]['gender']['displayValue'] }
          data={ this.state.gender }/>
        <HorizontalPercentageChart className='age' label='Age'
          category={ CATEGORY_DICT[this.props.role]['age']['value'] }
          displayCategory={ CATEGORY_DICT[this.props.role]['age']['displayValue'] }
          data={ this.state.age }/>
      </div>
    );
  }
});

RaceGenderAgeTab.OFFICER_ROLE = OFFICER_ROLE;
RaceGenderAgeTab.COMPLAINANT_ROLE = COMPLAINANT_ROLE;

module.exports = RaceGenderAgeTab;
