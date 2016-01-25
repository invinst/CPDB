var _ = require('lodash');
var React = require('react');
var classnames = require('classnames');
var ReactRouter = require('react-router');
var History = require('history');
var isMobile = require('ismobilejs');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;

var AppConstants = require('../../constants/AppConstants');
var AppStore = require('stores/AppStore');
var Back = require('components/Shared/Back.react');
var Base = require('components/Base.react');
var NavActions = require('actions/NavActions');
var SessionAPI = require('utils/SessionAPI');
var SiteTitle = require('components/Shared/SiteTitle.react');


var Nav = React.createClass(_.assign(Base(AppStore), {
  getDefaultProps: function () {
    return {
      page: 'data',
      navTabs: AppConstants.DEFAULT_NAV_TABS
    };
  },

  getDisplayComponent: function () {
    var isActive = this.props.isActive;

    return {
      navTabSection: !(isActive('officer') || isActive('investigator')),
      titleBox: isActive('data'),
      subNav: isActive('story'),
      backLink: isActive('officer') || isActive('investigator'),
      welcomeMessage: isActive('findings')
    };
  },

  goToPage: function (page, event) {
    if (!this.props.isActive(page)) {
      NavActions.goToPage(page);
    } else {
      event.preventDefault();
    }
  },

  getNavClass: function (tab) {
    return classnames('nav-link', {
      'active': this.props.isActive(tab)
    });
  },

  componentDidMount: function () {
    this.moveArrow();
  },

  componentDidUpdate: function () {
    this.moveArrow();
  },

  startNewSession: function (e) {
    if (this.props.isActive('data')){
      e.preventDefault();
      SessionAPI.getSessionInfo('');
    }
  },

  moveArrow: function () {
    $target = jQuery('.nav-link.active');
    $arrow = jQuery(".moving-arrow");

    if ($target.length && $arrow.length) {
      jQuery(".moving-arrow").css({
        left: $target.offset().left - 5,
        width: $target.width() + 10,
      }, 500);
    }
  },

  navigateSub: function (event) {
    event.preventDefault();
    var $body = $('body');
    var navBarHeight = 90;

    $element = $($(event.currentTarget).data('target'));
    $body.animate({
      scrollTop: $element.offset().top - navBarHeight
    }, 1000);
  },

  renderTitleBox: function () {
    return (
      <div className='site-title pull-left'>
        <SiteTitle changable={true} />
      </div>
    );
  },

  renderSubNav: function () {
    return (
      <div>
        <nav className='sub-nav story-nav'>
          <a href="#" className="pull-right" data-target="#next-steps" onClick={this.navigateSub}>
            Next Steps
          </a>
          <a href="#" className="pull-right" data-target="#invisible-institute" onClick={this.navigateSub}>
            The Invisible Institute
          </a>
          <a href="#" className="pull-right active" data-target="#stateway" onClick={this.navigateSub}>
            Stateway Gardens Litigation
          </a>
        </nav>
      </div>
    );
  },

  renderNavTabItems: function () {
    var self = this;

    return this.props.navTabs.map(function (navTab, index) {
      return (
        <li key={index} className={ self.getNavClass(navTab.name) }>
          <Link
            onClick={self.goToPage.bind(self, navTab.name)}
            to={AppStore.getNavTabUrl(navTab.name)}
            aria-controls={navTab.name}>{navTab.display}</Link>
        </li>
      );
    });
  },

  renderNavTabSection: function () {
    return (
      <ul className="pull-right" role="tablist">
        <span className="moving-arrow" />
        { this.renderNavTabItems() }
      </ul>
    );
  },

  renderWelcome: function () {
    return (
      <div className="welcome">
        <div className="page-logo">
        </div>
        <div className="page-banner">
          <p>Until recently, records of police misconduct in Chicago have been kept secret.</p>
          <p>In 2014, the court decision <i>Kalven v. Chicago</i> opened those files to the public.</p>
          <p>
            <Link data-target="data" to="/data">
              Explore the data.
            </Link>
          </p>
        </div>
      </div>
    );
  },

  render: function () {
    var display = this.getDisplayComponent();

    return (
      <div className="landing-page fixed-nav">
        { display.welcomeMessage ? this.renderWelcome() : '' }
        <nav className="landing-nav">
          <div className="items clearfix">
            <Link to='/' onClick={this.startNewSession} id='logo_link'>
              <img className="pull-left cpdp-logo" src="/static/img/cpdp-logo.svg" />
            </Link>
            { display.backLink ? <Back /> : '' }
            { display.titleBox ? this.renderTitleBox() : '' }
            { display.navTabSection ? this.renderNavTabSection() : '' }
          </div>
          { display.subNav ? this.renderSubNav() : '' }
        </nav>
      </div>
    );
  }
}));

module.exports = Nav;
