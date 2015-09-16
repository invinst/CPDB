var React = require('react');
var Content = require('./components/Content.react');
var Navigation = require('./components/Navigation.react');
var Period = require('./components/Period.react');


var contentEl = document.getElementById('content');
if(contentEl) {
    React.render(
        <Content />,
        contentEl
    );
}

var navigationEl = document.getElementById('navigation-menu');
if(navigationEl) {
    React.render(
        <Navigation />,
        navigationEl
    );
}

var periodEl = document.getElementById('period');
if (periodEl) {
    React.render(
      <Period />,
      periodEl
    );
}

