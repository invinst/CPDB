var React = require('react');
var ReactDOM = require('react-dom');
var Content = require('./components/Content.react');
var Navigation = require('./components/Navigation.react');
var Period = require('./components/Period.react');

var contentEl = document.getElementById('content');
var navigationEl = document.getElementById('navigation-menu');
var periodEl = document.getElementById('period');

if (contentEl) {
  ReactDOM.render(
    <Content />,
    contentEl
  );
}

if (navigationEl) {
  ReactDOM.render(
    <Navigation />,
    navigationEl
  );
}

if (periodEl) {
  ReactDOM.render(
    <Period />,
    periodEl
  );
}
