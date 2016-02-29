var _ = require('lodash');
var React = require('react');
var classnames = require('classnames');
var ReactRouter = require('react-router');

var Link = ReactRouter.Link;
var PropTypes = React.PropTypes;

var AppConstants = require('../../constants/AppConstants');
var AppStore = require('stores/AppStore');
var Back = require('components/Shared/Back.react');
var NavActions = require('actions/NavActions');
var SessionAPI = require('utils/SessionAPI');
var SiteTitle = require('components/Shared/SiteTitle.react');
var WagtailPagesStore = require('stores/WagtailPagesStore');
var ShareButton = require('components/DataToolPage/Share/ShareButton.react');
var Nav;

require('utils/jQuery');


Nav = React.createClass({
  propTypes: {
    isActive: PropTypes.func,
    navTabs: PropTypes.array
  },

  getDefaultProps: function () {
    return {
      page: 'data',
      navTabs: AppConstants.DEFAULT_NAV_TABS
    };
  },

  getInitialState: function () {
    return _.extend({}, AppStore.getState(), {
      wagtailPages: WagtailPagesStore.getWagtailPages()
    });
  },

  componentDidMount: function () {
    this.moveArrow();
    AppStore.addChangeListener(this._onChange);
    WagtailPagesStore.addChangeListener(this._receiveWagtailPage);
  },

  componentDidUpdate: function () {
    this.moveArrow();
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange);
    WagtailPagesStore.removeChangeListener(this._receiveWagtailPage);
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

  getIndexLink: function () {
    var isActive = this.props.isActive;

    if (isActive('officer') || isActive('investigator')) {
      return AppStore.getDataToolUrl();
    }
    return '/';
  },

  getNavClass: function (tab) {
    return classnames('nav-link', {
      'active': this.props.isActive(tab)
    });
  },

  _onChange: function () {
    this.setState(AppStore.getState());
  },

  _receiveWagtailPage: function () {
    this.setState({wagtailPages:WagtailPagesStore.getWagtailPages()});
  },

  goToPage: function (page, event) {
    if (!this.props.isActive(page)) {
      NavActions.goToPage(page);
    } else {
      event.preventDefault();
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
    var $element = $($(event.currentTarget).data('target'));
    var navBarHeight = 90;

    event.preventDefault();
    $body.animate({
      scrollTop: $element.offset().top - navBarHeight
    }, 1000);
  },

  startNewSession: function (e) {
    var isActive = this.props.isActive;
    if (isActive('data')) {
      e.preventDefault();
      SessionAPI.getSessionInfo('');
    }
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
      <ul className='pull-right' role='tablist'>
        <span className='moving-arrow' />
        { this.renderNavTabItems() }
        { this.renderWagtailTabs() }
      </ul>
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

  renderTitleBox: function () {
    return (
      <SiteTitle changable={ true } />
    );
  },

  renderWagtailTabs: function () {
    var that = this;

    if (this.state.wagtailPages) {
      return this.state.wagtailPages.map(function (wagtailPage, index) {
        var wagtailPageTo = '/' + wagtailPage.slug;

        return (
          <li className={ that.getNavClass(wagtailPage.slug) } key={ index }>
            <Link onClick={ that.goToPage.bind(that, wagtailPage.slug) }
              to={ wagtailPageTo }>{ wagtailPage.title }</Link>
          </li>
        );
      });
    }

    return '';
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
});

module.exports = Nav;
