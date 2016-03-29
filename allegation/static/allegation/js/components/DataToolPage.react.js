var _ = require('lodash');
var React = require('react');
var isMobile = require('ismobilejs');
var classnames = require('classnames');

var Base = require('components/Base.react');
var ComplaintSection = require('components/DataToolPage/ComplaintSection.react');
var FilterTags = require('components/DataToolPage/FilterTags.react');
var Map = require('components/DataToolPage/Map.react');
var OfficerList = require('components/DataToolPage/OfficerList.react');
var SessionStore = require('stores/SessionStore');
var Tabs = require('components/DataToolPage/Tabs.react');
var Search = require('components/Shared/Search.react');


var CPDBApp = React.createClass(_.assign(Base(SessionStore), {
  componentDidMount: function () {
    SessionStore.addChangeListener(this._onChange);

    this.initStickyFooter();
  },

  isPassAllegationSection: function () {
    var top = $(window).scrollTop();
    var documentList = $('#complaint-list');
    if (!documentList.size()) {
      return false;
    }

    if (SessionStore.isNoQuery()) {
      return false;
    }

    return top >= $('#complaint-list').offset().top;
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
    if (isSetStickyFooter) {
      $('body').addClass('stick-footer-bottom');
      $(window).off('scroll', this.setStickyFooter);
      $(window).on('scroll', this.unsetStickyFooter);
    }
  },

  initStickyFooter: function () {
    $(window).on('scroll', this.setStickyFooter);
  },

  renderTabs: function () {
    var mobileExpanded = isMobile.any && this.state.searchExpanded;

    if (isMobile.any) {
      return (
        <div className='row map-row mobile'>
          <div className='col-md-12'>
            <Search mobileExpanded={ mobileExpanded } />
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
          <div className='col-md-6 tabs-column'>
            <Search mobileExpanded={ mobileExpanded } />
            <Tabs />
          </div>
        </div>
      );
    }
  },

  render: function () {
    var complaintListContainerClassName = classnames('container-fluid content');
    return (
      <div id='data-tool'>
        <div className='container-fluid'>
          <div className='row' id='filter-row'>
            <div className='col-md-10'>
              <FilterTags />
            </div>
          </div>
        </div>
        <div className='container-fluid'>
          { this.renderTabs() }
        </div>
        <div className='white-background'>
          <div className='container-fluid content'>
            <div id='officer-cards'><OfficerList /></div>
          </div>
        </div>
        <div className={ complaintListContainerClassName }>
          <div id='complaint-list'><ComplaintSection /></div>
        </div>
      </div>
    );
  }
}));

module.exports = CPDBApp;
