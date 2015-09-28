var React = require('react'),
    RouterMixin = require('react-mini-router').RouterMixin;
var CPDBApp = require('components/HomePage/CPDBApp.react');
var OfficerPage = require('components/HomePage/OfficerPage.react');
var Router = React.createClass({

    mixins: [RouterMixin],

    routes: {
        '/': 'home',
        '/message/:text': 'message',
        '/officer/:officerSlug/:id': 'officer'
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

    officer: function(officerSlug, officerId) {
      return <OfficerPage officerId={officerId} />;
    },

    notFound: function(path) {
        return <div class="not-found">Page Not Found: {path}</div>;
    }

});

module.exports = Router;
