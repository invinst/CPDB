var _ = require('lodash');
var React = require('react');

var AutoComplete = require('components/HomePage/AutoComplete.react');
var AppConstants = require('constants/AppConstants');
var Base = require('components/Base.react');
var ComplaintSection = require('components/HomePage/ComplaintSection.react');
var EmbedBar = require('components/HomePage/Embed/Bar.react');
var Filters = require('components/HomePage/Filters.react');
var Map = require('components/HomePage/Map.react');
var OfficerList = require('components/HomePage/OfficerList.react');
var SessionAPI = require('utils/SessionAPI');
var SessionStore = require('stores/SessionStore');
var SiteTitle = require('components/HomePage/SiteTitle.react');
var Tabs = require('components/HomePage/Tabs.react');


var CPDBApp = React.createClass(_.assign(Base(SessionStore), {
  componentDidMount: function () {
    var session = this.props.session || '';
    SessionAPI.getSessionInfo(session);

    /*     this.initShare(); */
    $('.smooth-scroll').click(function() {q
      var target = $(this).data('target');
      var top = $(target).offset().top - 100;
      $("html, body").animate({scrollTop: top}, 500);
    })
  },

  render: function () {

    return (
      <div>
        <div className="navbar navbar-default">
          <div className="navbar-header">
            <a href="/" className="navbar-brand">
                <img src="" alt="" />
            </a>
            <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
            </button>
          </div>
          <div className="navbar-collapse collapse" id="navbar-main">
              <ul className="nav navbar-nav">
                <li className='site-title'>
                  <SiteTitle />
                </li>
              </ul>
              <form className="navbar-form navbar-right" role="search">
                <div id="search-wrapper">
                  <input type="text" id="autocomplete" placeholder="Search by name, neighborhood, or complaint" class="ui-autocomplete-input" autocomplete="off" />
                </div>
              </form>
          </div>
        </div>
        <div className='container-fluid'>
            <div className="row" id='filter-row'>
               <div className="col-md-10 col-md-offset-1">
                  <Filters />
               </div>
            </div>
          <div className='row map-row'>
            <div className='col-md-6 map-column relative'>
              <Map />
            </div>
            <div className='col-md-6 chart-row'>
              <Tabs />
            </div>
          </div>
          <div className='container content'>
            <div id='officer-cards'><OfficerList /></div>
            <div id='complaint-list'><ComplaintSection /></div>
          </div>
          <div>
            <div id='EmbedBar' className="row">
              <div className="col-md-12">
                <div className='container'>
                  <EmbedBar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}));

module.exports = CPDBApp;
