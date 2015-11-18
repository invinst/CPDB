var React = require('react'),
    RouterMixin = require('react-mini-router').RouterMixin;
var DataToolPage = require('components/DataToolPage.react');
var IndexPage = require('components/IndexPage.react');
var OfficerPage = require('components/OfficerPage.react');
var StoryPage = require('components/StoryPage.react');


var Router = React.createClass({
  mixins: [RouterMixin],

  routes: {
    '/': 'index',
    '/data-tools': 'home',
    '/data-tools/:session': 'home',
    '/data-tools/:session/:title': 'home',
    '/message/:text': 'message',
    '/officer/:officerSlug/:id': 'officer',
    '/story': 'story'
  },

  render: function() {
    return this.renderCurrentRoute();
  },

  index: function() {
    return this.home();/* FIXME */
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

  story: function() {
    return <StoryPage />;
  },

  notFound: function(path) {
    return <div className="not-found">Page Not Found: {path}</div>;
  }

});

module.exports = Router;
