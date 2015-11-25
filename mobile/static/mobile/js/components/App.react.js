var React = require('react');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;

var MainPage = require('components/MainPage.react');
var NoMatch = require('components/NoMatch.react');
var ComplaintPage = require('components/ComplaintPage.react');


var App = React.createClass({
  render: function () {
    return (
      <Router>
        <Route path="/complaint" component={ComplaintPage}/>
        <Route path="/" component={MainPage}/>
        <Route path="*" component={NoMatch}/>
      </Router>
    );
  }
});

module.exports = App;
