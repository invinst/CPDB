var _ = require('lodash');
var navigate = require('react-mini-router').navigate;
var React = require('react');
var ReactRouter = require('react-router');
var History = require('history');
var classnames = require('classnames');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;

var AppConstants = require('constants/AppConstants');
var Base = require('components/Base.react');
var AppStore = require('stores/AppStore');
var NavActions = require('actions/NavActions');
var PageAnimator = require('components/PageAnimator.react');
var StatePropagateCSSTransitionGroup = require(
  'components/Shared/StatePropagateCSSTransitionGroup.react');


var IndexPage = React.createClass(_.assign(Base(AppStore), {
  componentDidMount: function () {
    AppStore.addChangeListener(this._onChange);
    AppStore.addChangeSessionListener(this.onChangeSession);

    $(window).on('scroll', this.scrollToggleShow);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange);
    AppStore.removeChangeSessionListener(this.onChangeSession)
    $(window).off('scroll', this.scrollToggleShow);
  },

  componentWillMount: function () {
    this.displayTabByPath();
  },

  onChangeSession: function () {
    if (AppStore.isDataToolPage()) {
      history.replaceState(null, null, AppStore.getDataToolUrl());
    }
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return (!_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state));
  },

  componentDidUpdate: function () {
    this.displayTabByPath();
  },

  displayTabByPath: function () {
    var page = _.remove(window.location.pathname.split('/'))[0];
    if (!page) {
      page = 'data';
    }
    if (!AppStore.isPage(page)) {
      NavActions.goToPage(page, this.params);
    }
  },

  scrollToggleShow: function () {
    var $welcome = $('.welcome');
    var $landingNav = $('.landing-nav');
    var $main = $('.main');
    var $cpdpLogo = $('.cpdp-logo');
    var $iiLogo = $('.page-logo');

    var scrollTop = $(window).scrollTop();
    var cond = scrollTop >= $welcome.height();
    $landingNav.toggleClass('fixed-nav', cond);
    $landingNav.toggleClass('border-top', scrollTop != 0);
    $main.toggleClass('margin-top-45', cond);
    var opacity = scrollTop / $welcome.height()
    $cpdpLogo.css('opacity', opacity);
    $iiLogo.css('opacity', 1 - opacity);
    this.syncNavState();
  },

  syncNavState: function () {
    var navBarHeight = 90;
    var navItems = $('.landing-nav .sub-nav a');
    var currentPos = $(window).scrollTop() + navBarHeight;

    for(var index = 0; index < navItems.length; index++) {
      var item = $(navItems[index]);
      var $control = $(item.data('target'));
      if(!$control.offset()){
        console.log($control);
      }

      if (currentPos >= $control.offset().top) {
        navItems.removeClass('active');
        item.addClass('active');
        break;
      }
    }
  },

  render: function() {
    return (
      <div className='page-wrapper'>
        <StatePropagateCSSTransitionGroup
          transitionName="page"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
            <PageAnimator className='page' key={this.props.location.pathname}>
              { React.cloneElement(this.props.children) }
            </PageAnimator>
        </StatePropagateCSSTransitionGroup>
      </div>
    );
  }
}));

module.exports = IndexPage;
