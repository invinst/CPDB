var React = require('react'),
    RouterMixin = require('react-mini-router').RouterMixin;
var DataToolPage = require('components/DataToolPage.react');
var IndexPage = require('components/IndexPage.react');
var OfficerPage = require('components/OfficerPage.react');
var Router = React.createClass({
  mixins: [RouterMixin],

  routes: {
    '/': 'index',
    '/data-tools': 'home',
    '/data-tools/:session': 'home',
    '/data-tools/:session/:title': 'home',
    '/message/:text': 'message',
    '/officer/:officerSlug/:id': 'officer'
  },

  render: function() {
    return this.renderCurrentRoute();
  },

  index: function() {
    return (<IndexPage />);
  },

  home: function(session, title) {
    session = _.isObject(session) ? '' : session;
    return (<DataToolPage session={session}/>)
  },

  message: function(text) {
    return <div>{text}</div>;
  },

  officer: function(officerSlug, officerId) {
    return <OfficerPage officerId={officerId} />;
  },

  notFound: function(path) {
    return <div class="not-found">Page Not Found: {path}</div>;
  }

});

module.exports = Router;
