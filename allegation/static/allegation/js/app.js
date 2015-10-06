var React = require('react');
var Router = require('./components/Router.react');

var element = document.getElementById('router');

if(element) {
    React.render(
        <Router />,
        element
    );
}
