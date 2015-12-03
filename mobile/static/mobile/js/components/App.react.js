var React = require('react');
var Route = require('react-router').Route;
var Router = require('react-router').Router;

var ComplaintPage = require('components/ComplaintPage.react');
var MainPage = require('components/MainPage.react');
var NoMatch = require('components/NoMatch.react');
var TestPage = require('components/TestPage.react');
var OfficerPage = require('components/OfficerPage.react');


var App = React.createClass({
  render: function () {
    return (
      <Router>
        <Route path='/complaint' component={ComplaintPage}/>
        <Route path='/officer' component={OfficerPage}/>
        <Route path='/test' component={TestPage}/>
        <Route path='/' component={MainPage}/>
        <Route path='*' component={NoMatch}/>
      </Router>
    );
  }
});

module.exports = App;