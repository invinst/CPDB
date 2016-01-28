var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('./components/Router.react');
var Embed = require('./components/DataToolPage/Embed.react');

require('keyboardShortcuts');


global.initReact = function () {
  var element = document.getElementById('router');

  if(element) {
    ReactDOM.render(
      <Router />,
      element
    );
  }

  var embed = document.getElementById('embed');
  if (embed) {
    ReactDOM.render(
      <Embed page={ PAGE } pk={ PK } query={ QUERY } state={ STATE } />,
      embed
    );
  }
};
