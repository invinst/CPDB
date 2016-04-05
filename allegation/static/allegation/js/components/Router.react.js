var React = require('react');
var ReactRouter = require('react-router');
var IndexRoute = ReactRouter.IndexRoute;

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var History = ReactRouter.browserHistory;

var IndexPage = require('components/IndexPage.react');
var OfficerPage = require('components/OfficerPage.react');
var InvestigatorPage = require('components/InvestigatorPage.react');

var AppConstants = require('../constants/AppConstants');
var DataPage = require('components/IndexTabContent/DataPage.react');
var FindingPage = require('components/IndexTabContent/FindingPage.react');
var MethodPage = require('components/IndexTabContent/MethodPage.react');
var StoryPage = require('components/IndexTabContent/StoryPage.react');
var SessionAPI = require('utils/SessionAPI');
var S = require('string');
var WagtailPage = require('components/WagtailPage.react');

var RootRouter;

// disable scroll restoration
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}


RootRouter = React.createClass({
  onEnterData: function (nextState, replaceState, callback) {
    var sessionCallBack = function (data) {
      var siteTitle, url;

      if (!(nextState.params.session && nextState.params.title)) {
        siteTitle = S(data.title || AppConstants.DEFAULT_SITE_TITLE).slugify().s;
        url = ['', 'data', data.hash, siteTitle].join('/');
        replaceState(url);
      }
      callback();
    };

    SessionAPI.getSessionInfoRouter(nextState.params.session, sessionCallBack);
  },

  render: function () {
    return (
      <Router history={ History }>
        <Route path='/' component={ IndexPage }>
          <IndexRoute onEnter={ this.onEnterData }/>
          <Route path='findings' component={ FindingPage }/>
          <Route path='method' component={ MethodPage }/>
          <Route path='story' component={ StoryPage }/>
          <Route path='data' onEnter={ this.onEnterData }>
            <Route path=':session'>
              <Route path=':title' component={ DataPage }/>
            </Route>
          </Route>

          <Route path='officer'>
            <Route path=':slug'>
              <Route path=':id' component={ OfficerPage }/>
            </Route>
          </Route>
          <Route path='investigator'>
            <Route path=':slug'>
              <Route path=':id' component={ InvestigatorPage }/>
            </Route>
          </Route>
          <Route path='/:page' component={ WagtailPage }/>
        </Route>
      </Router>
    );
  }
});

module.exports = RootRouter;
