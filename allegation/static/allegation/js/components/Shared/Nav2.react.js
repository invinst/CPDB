var _ = require('lodash');
var React = require('react');
var classnames = require('classnames');
var ReactRouter = require('react-router');
var History = require('history');
var isMobile = require('ismobilejs');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;

var Base = require('components/Base.react');
var AppStore = require('stores/AppStore');
var NavActions = require('actions/NavActions');
var SessionAPI = require('utils/SessionAPI');
var SiteTitle = require('components/Shared/SiteTitle.react');


var Nav = React.createClass(_.assign(Base(AppStore), {
  goToPage: function (page) {
    NavActions.goToPage(page);
  },

  goToDataTool: function () {
    this.goToPage('data');
  },

  goToStoryPage: function () {
    this.goToPage('story');
  },

  goToFindingPage: function () {
    this.goToPage('findings');
  },

  goToMethodPage: function () {
    this.goToPage('method');
  },

  getNavClass: function (tab) {
    return classnames('nav-link', {
      'active': tab == this.state.page,
    });
  },

  componentDidUpdate: function () {
    this.moveArrow();
    this.updateBrowserAddress();
  },

  updateBrowserAddress: function () {
    setTimeout(function () {
      if (AppStore.isDataToolPage()) {
        history.replaceState(null, null, AppStore.getDataToolUrl());
      }
    }, 1);
  },

  componentDidMount: function () {
    this.moveArrow();
    this.attachWindowScroll();
  },

  attachWindowScroll: function () {
    var $body = $('body');
    var navBarHeight = 90;


    $(document).on('click', '.story-nav a', function() {
      $element = $($(this).data('target'));
      $body.animate({
          scrollTop: $element.offset().top - navBarHeight
      }, 1000);
      return false;
    });
  },

  moveArrow: function () {
    $target = jQuery('.nav-link.active');
    jQuery(".moving-arrow").css({
      left: $target.offset().left - 5,
      width: $target.width() + 10,
    }, 500);
  },

  startNewSession: function (e) {
    e.preventDefault();
    SessionAPI.getSessionInfo('');
  },

  render: function () {
    var mobileExpanded = isMobile.any && this.state.searchExpanded;

    var subNavClass = classnames('sub-nav', {
      'hidden': !AppStore.isStoryPage()
    });

    var navClass = classnames('landing-nav', {
      'fixed-nav': !AppStore.isFindingPage()
    });

    var navbarClass = classnames(
      'navbar-collapse',
      {
        'hidden': mobileExpanded
      }
    );

    var dataToolUrl = AppStore.getDataToolUrl();
    var siteTitleClass = classnames('site-title pull-left', {
      hidden: !AppStore.isDataToolPage()
    });

    return (
      <nav className="landing-nav">
        <div className="items clearfix">
          <a href="/" onClick={this.startNewSession} id="logo_link">
            <img className="pull-left cpdp-logo" src="/static/img/cpdp-logo.svg" />
          </a>
          <div className={siteTitleClass}>
            <SiteTitle changable={true} />
          </div>
          <ul className="pull-right" role="tablist">
            <span className="moving-arrow" />
            <li className={this.getNavClass("data")}><Link onClick={this.goToDataTool} to={dataToolUrl} aria-controls="data">Data</Link></li>
            <li className={this.getNavClass("method")}><Link onClick={this.goToMethodPage} to="/method" aria-controls="method">Methods</Link></li>
            <li className={this.getNavClass("story")}><Link onClick={this.goToStoryPage} to="/story" aria-controls="story">Stories</Link></li>
            <li className={this.getNavClass("findings")}><Link onClick={this.goToFindingPage} to="/findings" aria-controls="findings">Findings</Link></li>
          </ul>
        </div>
        <div className={subNavClass}>
          <nav className='story-nav'>
            <a href="#" className="pull-right" data-target="#next-steps">Next Steps</a>
            <a href="#" className="pull-right" data-target="#invisible-institute">The Invisible Institute</a>
            <a href="#" className="pull-right active" data-target="#stateway">Stateway Gardens Litigation</a>
          </nav>
        </div>
      </nav>
    );
  }
}));

module.exports = Nav;
