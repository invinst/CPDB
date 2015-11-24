var React = require('react');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;

var MainPage = require('components/MainPage.react');
var SearchResultPage = require('components/SearchResultPage.react');
var NoMatch = require('components/NoMatch.react');


var App = React.createClass({
  render: function () {
    return (
      <Router>
        <Route path="/" component={MainPage}>
          <Route path="results" component={SearchResultPage}/>
          <Route path="*" component={NoMatch}/>
        </Route>
      </Router>
    );
  }
});

module.exports = App;
