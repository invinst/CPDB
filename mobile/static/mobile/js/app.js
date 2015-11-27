var React = require('react');
var App = require('./components/App.react');


var element = document.getElementById('router');

if (element) {
  React.render(
    <App />,
    element
  );
}
