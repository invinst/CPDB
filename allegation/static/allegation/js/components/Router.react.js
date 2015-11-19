var React = require('react');
var ReactRouter = require('react-router');
var History = require('history');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var IndexRoute = ReactRouter.IndexRoute;

var IndexPage = require('components/IndexPage.react');
var DataToolPage = require('components/DataToolPage.react');


var RootRouter = React.createClass({
  render: function() {
    var history = History.useBasename(History.createHistory)({
      basename: '/'
    });

    return (
      <Router history={history}>
        <Route path="/" component={IndexPage}>
        </Route>
        <Route path="/findings" component={IndexPage}>
        </Route>
        <Route path="/method" component={IndexPage}>
        </Route>
        <Route path="/story" component={IndexPage}>
        </Route>
        <Route path="/data" component={IndexPage}>
        </Route>
      </Router>
    );
  },
});

module.exports = RootRouter;
