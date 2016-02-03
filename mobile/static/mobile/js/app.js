var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/App.react');


var element = document.getElementById('router');

if (element) {
  ReactDOM.render(
    <App />,
    element
  );
}
