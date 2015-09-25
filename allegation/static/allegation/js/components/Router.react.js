var React = require('react'),
    RouterMixin = require('react-mini-router').RouterMixin;
var CPDBApp = require('components/HomePage/CPDBApp.react');
var Router = React.createClass({

    mixins: [RouterMixin],

    routes: {
        '/': 'home',
        '/message/:text': 'message'
    },

    render: function() {
        return this.renderCurrentRoute();
    },

    home: function() {
        return (<CPDBApp />)
    },

    message: function(text) {
        return <div>{text}</div>;
    },

    notFound: function(path) {
        return <div class="not-found">Page Not Found: {path}</div>;
    }

});

module.exports = Router;
