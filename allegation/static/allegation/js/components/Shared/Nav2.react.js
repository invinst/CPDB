var _ = require('lodash');
var React = require('react');
var classnames = require('classnames');
var ReactRouter = require('react-router');

var Link = ReactRouter.Link;

var AppConstants = require('../../constants/AppConstants');
var AppStore = require('stores/AppStore');
var Back = require('components/Shared/Back.react');
var Base = require('components/Base.react');
var NavActions = require('actions/NavActions');
var SessionAPI = require('utils/SessionAPI');
var SiteTitle = require('components/Shared/SiteTitle.react');
var ShareButton = require('components/DataToolPage/Share/ShareButton.react');
var Nav;
var PageUtils = require('utils/PageUtils');

require('utils/jQuery');


Nav = React.createClass(_.assign(Base(AppStore), {
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
      shareButton: isActive('data'),
      subNav: isActive('story'),
      backLink: isActive('officer') || isActive('investigator'),
      welcomeMessage: isActive('findings'),
      fixedNav: isActive('data')
    };
  },

  goToPage: function (page, event) {
    if (!this.props.isActive(page)) {
      PageUtils.hideOverlay();
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

  getIndexLink: function () {
    var isActive = this.props.isActive;

    if (isActive('officer') || isActive('investigator')) {
      return AppStore.getDataToolUrl();
    }
    return '/';
  },

  componentDidMount: function () {
    this.moveArrow();
  },

  componentDidUpdate: function () {
    this.moveArrow();
  },

  startNewSession: function (e) {
    var isActive = this.props.isActive;
    if (isActive('data')) {
      e.preventDefault();
      SessionAPI.getSessionInfo('');
    }
  },

  moveArrow: function () {
    var $target = jQuery('.nav-link.active');
    var $arrow = jQuery('.moving-arrow');

    if ($target.length && $arrow.length) {
      jQuery('.moving-arrow').css({
        left: $target.offset().left - 5,
        width: $target.width() + 10
      }, 500);
    }
  },

  navigateSub: function (event) {
    var $body = $('body');
    var navBarHeight = 90;
    var $element = $($(event.currentTarget).data('target'));

    event.preventDefault();

    $body.animate({
      scrollTop: $element.offset().top - navBarHeight
    }, 1000);
  },

  renderTitleBox: function () {
    return (
      <SiteTitle changable={ true } />
    );
  },

  renderSubNav: function () {
    return (
      <div>
        <nav className='sub-nav story-nav'>
          <a href='#' className='pull-right' data-target='#next-steps' onClick={ this.navigateSub }>
            Next Steps
          </a>
          <a href='#' className='pull-right' data-target='#invisible-institute' onClick={ this.navigateSub }>
            The Invisible Institute
          </a>
          <a href='#' className='pull-right active' data-target='#stateway' onClick={ this.navigateSub }>
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
        <li key={ index } className={ self.getNavClass(navTab.name) }>
          <Link
            onClick={ self.goToPage.bind(self, navTab.name) }
            to={ AppStore.getNavTabUrl(navTab.name) }
            aria-controls={ navTab.name }>{ navTab.display }</Link>
        </li>
      );
    });
  },

  renderNavTabSection: function () {
    return (
      <div className='nav-tabs pull-right'>
        <ul className='visible-md visible-lg' role='tablist'>
          <span className='moving-arrow' />
          { this.renderNavTabItems() }
        </ul>
        <i onClick={ this.showNavTabsSidebar } className='fa fa-bars visible-sm visible-xs'></i>
        <div className='hidden nav-tabs-sidebar'>
          <ul role='tablist'>
            <i onClick={ this.hideNavTabsSidebar } className='fa fa-times'></i>
            { this.renderNavTabItems() }
          </ul>
        </div>
      </div>
    );
  },

  showNavTabsSidebar: function () {
    $('.nav-tabs-sidebar').removeClass('hidden');
    PageUtils.showOverlay();
  },

  hideNavTabsSidebar: function () {
    $('.nav-tabs-sidebar').addClass('hidden');
    PageUtils.hideOverlay();
  },

  renderWelcome: function () {
    return (
      <div className='welcome'>
        <div className='page-logo'>
        </div>
        <div className='page-banner'>
          <p>Until recently, records of police misconduct in Chicago have been kept secret.</p>
          <p>In 2014, the court decision <i>Kalven v. Chicago</i> opened those files to the public.</p>
          <p>
            <Link data-target='data' to='/data'>
              Explore the data.
            </Link>
          </p>
        </div>
      </div>
    );
  },

  render: function () {
    var display = this.getDisplayComponent();
    var navClassName = classnames('landing-nav', {
      'fixed-nav': display.fixedNav
    });

    return (
      <div className='landing-page fixed-nav'>
        { display.welcomeMessage ? this.renderWelcome() : '' }
        <nav className={ navClassName }>
          <div className='items clearfix'>
            <Link to={ this.getIndexLink() } onClick={ this.startNewSession } id='logo_link'>
              <img className='pull-left cpdp-logo' src='/static/img/cpdp-logo.svg' />
            </Link>
            { display.backLink ? <Back /> : '' }
            { display.titleBox ? this.renderTitleBox() : '' }
            { display.shareButton ? <ShareButton/> : '' }
            { display.navTabSection ? this.renderNavTabSection() : '' }
          </div>
          { display.subNav ? this.renderSubNav() : '' }
        </nav>
      </div>
    );
  }
}));

module.exports = Nav;
