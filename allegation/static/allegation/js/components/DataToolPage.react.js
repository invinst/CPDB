var _ = require('lodash');
var React = require('react');
var isMobile = require('ismobilejs');

var AppConstants = require('constants/AppConstants');
var Base = require('components/Base.react');
var ComplaintSection = require('components/DataToolPage/ComplaintSection.react');
var Disclaimer = require('components/DataToolPage/Disclaimer.react');
var EmbedBar = require('components/DataToolPage/Embed/Bar.react');
var Footer = require('components/DataToolPage/Footer.react');
var Filters = require('components/DataToolPage/Filters.react');
var Map = require('components/DataToolPage/Map.react');
var OfficerList = require('components/DataToolPage/OfficerList.react');
var SessionAPI = require('utils/SessionAPI');
var SessionStore = require('stores/SessionStore');
var Tabs = require('components/DataToolPage/Tabs.react');
var Nav = require('components/DataToolPage/Nav.react');
var HappyFox = require('components/Shared/HappyFox.react');


var CPDBApp = React.createClass(_.assign(Base(SessionStore), {
  componentDidMount: function () {
    var session = this.props.session || '';
    SessionAPI.getSessionInfo(session);

    $('.smooth-scroll').click(function() {
      var target = $(this).data('target');
      var top = $(target).offset().top - 100;
      $("html, body").animate({scrollTop: top}, 500);
    });

    this.initStickyFooter();
  },

  isPassAllegationSection: function () {
    var top = $(window).scrollTop();
    var documentList = $("#complaint-list");
    if (!documentList.size()) {
      return false;
    }

    return top >= $("#complaint-list").offset().top;
  },

  unsetStickyFooter: function () {
    var isSetStickyFooter = this.isPassAllegationSection();
    if (!isSetStickyFooter) {
      $('body').removeClass('stick-footer-bottom');
      $(window).on('scroll', this.setStickyFooter);
      $(window).off('scroll', this.unsetStickyFooter);
    }
  },

  setStickyFooter: function () {
    var isSetStickyFooter = this.isPassAllegationSection();
    if(isSetStickyFooter) {
      $('body').addClass('stick-footer-bottom');
      $(window).off('scroll', this.setStickyFooter);
      $(window).on('scroll', this.unsetStickyFooter);
    }
  },

  initStickyFooter: function () {
    $(window).on('scroll', this.setStickyFooter);
  },

  renderTabs: function () {
    if (isMobile.any) {
      return (
        <div className='row map-row mobile'>
          <div className='col-md-12 chart-row'>
            <Tabs mobile='true' />
          </div>
        </div>
      );
    } else {
      return (
        <div className='row map-row'>
          <div className='col-md-6 map-column relative'>
            <Map />
          </div>
          <div className='col-md-6 chart-row'>
            <Tabs />
          </div>
        </div>
      );
    }
  },

  render: function () {
    return (
      <div>
        <Nav />
        <div className='container-fluid'>
            <div className="row" id='filter-row'>
               <div className="col-md-10 col-md-offset-1">
                  <Filters />
               </div>
            </div>
          { this.renderTabs() }
          <div className='container content'>
            <div id='officer-cards'><OfficerList /></div>
            <div id='complaint-list'><ComplaintSection /></div>
          </div>

          <div className='sticky-footer'>
            <div id='EmbedBar' className="row">
              <div className="col-md-12">
                <div className='container'>
                  <EmbedBar />
                </div>
              </div>
            </div>
            <Footer />
          </div>

        </div>
        <Disclaimer />
        <HappyFox />
      </div>
    );
  }
}));

module.exports = CPDBApp;
