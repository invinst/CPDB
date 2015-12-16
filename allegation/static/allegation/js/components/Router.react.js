var React = require('react/addons');
var ReactRouter = require('react-router');
var IndexRoute = ReactRouter.IndexRoute;
var History = require('history');
var ReactCSSTransitionGroup = require('react/lib/ReactCSSTransitionGroup');
var StaticContainer = require('react-static-container');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var IndexRoute = ReactRouter.IndexRoute;

var IndexPage = require('components/IndexPage.react');
var DataToolPage = require('components/DataToolPage.react');
var OfficerPage = require('components/OfficerPage.react');
var StatePropagateCSSTransitionGroup = require(
  'components/Shared/StatePropagateCSSTransitionGroup.react');


var RootPage = React.createClass({

  render: function () {
    return (
      <div className='page-wrapper'>
        <StatePropagateCSSTransitionGroup transitionName="page" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
          <PageAnimator className='page' key={this.props.location.pathname}>
            {this.props.children}
          </PageAnimator>
        </StatePropagateCSSTransitionGroup>
      </div>
    )
  }
});

var PageAnimator = React.createClass({
  getInitialState: function () {
    return {
      previousPathname: null
    };
  },

  contextTypes: {
    location: React.PropTypes.object
  },

  renderChildren: function () {
    var animator = this;

    return React.cloneElement(this.props.children, {
      entered: this.props.entered,
    });
  },

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.location.pathname !== this.context.location.pathname) {
      this.setState({ previousPathname: this.context.location.pathname })
    }
  },

  componentDidUpdate() {
    if (this.state.previousPathname) {
      this.setState({ previousPathname: null })
    }
  },

  render: function () {
    return <div className={this.props.className}>
      <StaticContainer shouldUpdate={!this.state.previousPathname}>
        {this.renderChildren()}
      </StaticContainer>
    </div>;
  },
})

var RootRouter = React.createClass({
  render: function() {
    var history = History.useBasename(History.createHistory)({
      basename: '/'
    });

    return (
      <Router history={history}>
        <Route path="/" component={RootPage}>
          <IndexRoute component={IndexPage} />
          <Route path="/findings" component={IndexPage}>
          </Route>
          <Route path="/method" component={IndexPage}>
          </Route>
          <Route path="/story" component={IndexPage}>
          </Route>
          <Route path="/data" component={IndexPage}>
          </Route>
          <Route path="/data/:session/" component={IndexPage}>
          </Route>
          <Route path="/data/:session/:title" component={IndexPage}>
          </Route>
          <Route path="/officer/:slug/:id" component={OfficerPage}>
          </Route>
        </Route>
      </Router>
    );
  },
});

module.exports = RootRouter;
