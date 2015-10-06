var React = require('react');
var RouterMixin = require('react-mini-router').RouterMixin;

var OverviewSection = require('./OverviewSection.react');
var OfficerSection = require('./OfficerSection.react');
var SearchSection = require('./SearchSection.react');

var ContentStore = require("../stores/ContentStore.js");


var Content = React.createClass({
  mixins: [RouterMixin],

  routes: {
    '/' : 'overviewSection',
    '/search': 'searchSection',
    '/officer': 'officerSection',
  },

  overviewSection: function() {
    return <OverviewSection />;
  },

  searchSection: function() {
    return <SearchSection />;
  },

  officerSection: function() {
    return <OfficerSection />;
  },

  getInitialState: function() {
    return {};
  },

  render: function() {
    return this.renderCurrentRoute();
  },
});

module.exports = Content;
