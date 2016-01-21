var React = require('react');
var ReactRouter = require('react-router');
var IndexRoute = ReactRouter.IndexRoute;
var History = require('history');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var IndexRoute = ReactRouter.IndexRoute;

var IndexPage = require('components/IndexPage.react');
var DataToolPage = require('components/DataToolPage.react');
var OfficerPage = require('components/OfficerPage.react');
var InvestigatorPage = require('components/InvestigatorPage.react');

var DataPage = require('components/IndexTabContent/DataPage.react');
var FindingPage = require('components/IndexTabContent/FindingPage.react');
var MethodPage = require('components/IndexTabContent/MethodPage.react');
var StoryPage = require('components/IndexTabContent/StoryPage.react');

var RootRouter = React.createClass({
  render: function() {
    var history = History.useBasename(History.createHistory)({
      basename: '/'
    });

    return (
      <Router history={history}>
        <Route path="/" component={IndexPage}>
          <IndexRoute component={DataPage} />
          <Route path="/findings" component={FindingPage}>
          </Route>
          <Route path="/method" component={MethodPage}>
          </Route>
          <Route path="/story" component={StoryPage}>
          </Route>
          <Route path="/data" component={DataPage}>
          </Route>
          <Route path="/data/:session/" component={DataPage}>
          </Route>
          <Route path="/data/:session/:title" component={DataPage}>
          </Route>
          <Route path="/officer/:slug/:id" component={OfficerPage}>
          </Route>
          <Route path="/investigator/:slug/:id" component={InvestigatorPage}>
          </Route>
        </Route>
      </Router>
    );
  },
});

module.exports = RootRouter;
