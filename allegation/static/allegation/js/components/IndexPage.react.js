var classnames = require('classnames');
var React = require('react');
var PropTypes = React.PropTypes;
var PureRenderMixin = require('react-addons-pure-render-mixin');

var PageAnimator = require('components/PageAnimator.react');
var StatePropagateCSSTransitionGroup = require(
  'components/Shared/StatePropagateCSSTransitionGroup.react');
var Nav = require('components/Shared/Nav2.react');
var IndexTabContentMixin = require('mixins/IndexTabContentMixin');
var Disclaimer = require('components/DataToolPage/Disclaimer.react');
var LandingFooter = require('components/Shared/LandingFooter.react');
var Footer = require('components/DataToolPage/Footer.react');
var HappyFox = require('components/Shared/HappyFox.react');


var IndexPage = React.createClass({
  propTypes: {
    children: PropTypes.node,
    location: PropTypes.object
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  mixins: [PureRenderMixin, IndexTabContentMixin],

  componentDidMount: function () {
    $(window).on('scroll', this.scrollToggleShow);
  },

  componentWillUnmount: function () {
    $(window).off('scroll', this.scrollToggleShow);
  },

  isLandingPage: function () {
    var isActive = this.context.router.isActive;
    return !(isActive('investigator') || isActive('officer') || isActive('data'));
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
    var opacity = scrollTop / $welcome.height();
    $cpdpLogo.css('opacity', opacity);
    $iiLogo.css('opacity', 1 - opacity);
    this.syncNavState();
  },

  syncNavState: function () {
    var navBarHeight = 90;
    var navItems = $('.landing-nav .sub-nav a');
    var currentPos = $(window).scrollTop() + navBarHeight;

    for (var index = 0; index < navItems.length; index++) {
      var item = $(navItems[index]);
      var $control = $(item.data('target'));

      if (currentPos >= $control.offset().top) {
        navItems.removeClass('active');
        item.addClass('active');
        break;
      }
    }
  },

  renderContent: function () {
    var isActive = this.context.router.isActive;

    var tabPanelClass = classnames('tab-pane active',{
      'landing-page': !(isActive('data') || isActive('officer') || isActive('investigator'))
    });

    var mainClassName = classnames('main', {
      'margin-top-45': isActive('data')
    });

    return (
      <div className={ mainClassName }>
        <div className='tab-content'>
          <div role='tabpanel' className={ tabPanelClass }>
            { this.props.children }
          </div>
        </div>
      </div>
    );
  },

  renderFooter: function () {
    return (
      <div className='container-fluid'>
        <div className='sticky-footer'>
          <Footer withEmbedBar={ this.context.router.isActive('data') }/>
        </div>
      </div>
    );
  },

  renderFooterLandingPage: function () {
    return (
      <div className='landing-page'>
        <LandingFooter />
      </div>
    );
  },

  renderFooterWrapper: function () {
    return (
      <div>
        { this.isLandingPage() ? this.renderFooterLandingPage() : this.renderFooter() }
        <Disclaimer />
        <HappyFox />
      </div>
    );
  },

  render: function () {
    var isActive = this.context.router.isActive;

    var pageClassName = classnames({
      'scroll-to-top': !isActive('findings')
    });

    return (
      <div className='page-wrapper'>
        <StatePropagateCSSTransitionGroup
          transitionName='page'
          transitionEnterTimeout={ 500 }
          transitionLeaveTimeout={ 500 }>
          <PageAnimator className='page' key={ this.props.location.pathname }>
            <div id='landing-page' className={ pageClassName }>
              <Nav isActive={ this.context.router.isActive }/>
              { this.renderContent() }
              { this.renderFooterWrapper() }
            </div>
          </PageAnimator>
        </StatePropagateCSSTransitionGroup>
      </div>
    );
  }
});

module.exports = IndexPage;
