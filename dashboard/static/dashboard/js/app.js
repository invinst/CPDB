var React = require('react');
var ReactDOM = require('react-dom');
var Content = require('./components/Content.react');
var Navigation = require('./components/Navigation.react');
var Period = require('./components/Period.react');

var contentEl = document.getElementById('content');
if (contentEl) {
  ReactDOM.render(
    <Content />,
    contentEl
  );
}

var navigationEl = document.getElementById('navigation-menu');
if (navigationEl) {
  ReactDOM.render(
    <Navigation />,
    navigationEl
  );
}

var periodEl = document.getElementById('period');
if (periodEl) {
  ReactDOM.render(
    <Period />,
    periodEl
  );
}
