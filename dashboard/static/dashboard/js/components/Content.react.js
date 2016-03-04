var React = require('react');
var RouterMixin = require('react-mini-router').RouterMixin;

var OverviewSection = require('./OverviewSection.react');
var OfficerSection = require('./OfficerSection.react');
var SearchSection = require('./SearchSection.react');
var SessionSection = require('components/SessionSection.react');
var DocumentSection = require('./DocumentSection.react');
var SettingSection = require('components/SettingSection.react');
var InterfaceTextSection = require('components/InterfaceTextSection.react');

var Content;

require('../stores/ContentStore.js');


Content = React.createClass({
  mixins: [RouterMixin],

  getInitialState: function () {
    return {};
  },

  routes: {
    '/' : 'overviewSection',
    '/search': 'searchSection',
    '/officer': 'officerSection',
    '/document': 'documentSection',
    '/session': 'sessionSection',
    '/setting': 'settingSection',
    '/interface-text': 'interfaceTextSection'
  },

  overviewSection: function () {
    return <OverviewSection />;
  },

  searchSection: function () {
    return <SearchSection />;
  },

  officerSection: function (params) {
    return <OfficerSection params={ params } />;
  },

  documentSection: function (params) {
    return <DocumentSection params={ params } />;
  },

  sessionSection: function () {
    return <SessionSection />;
  },

  settingSection: function () {
    return <SettingSection />;
  },

  interfaceTextSection: function () {
    return <InterfaceTextSection />;
  },

  render: function () {
    return this.renderCurrentRoute();
  }
});

module.exports = Content;
