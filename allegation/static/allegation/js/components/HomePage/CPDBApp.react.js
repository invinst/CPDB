var React = require('react');

var ComplaintSection = require('components/HomePage/ComplaintSection.react');
var EmbedBar = require('components/HomePage/Embed/Bar.react');
var Filters = require('components/HomePage/Filters.react');
var Map = require('components/HomePage/Map.react');
var Tabs = require('components/HomePage/Tabs.react');
var OfficerList = require('components/HomePage/OfficerList.react');
var SiteTitle = require('components/HomePage/SiteTitle.react');
var AutoComplete = require('components/HomePage/AutoComplete.react');

function getMapState() {
  return {};
}

HOME_URL = location.pathname;
SAVE_STATE = false;
SESSION_HASH = '';

var CPDBApp = React.createClass({

  getInitialState: function () {
    return getMapState();
  },
  initShare: function () {
    if (location.pathname == '/') {
      $.getJSON('/share/init/', function (data) {
        SESSION_HASH = data.session.hash_id;
        HOME_URL = "/" + SESSION_HASH + "/";
        history.pushState({}, '', HOME_URL);
        SAVE_STATE = true;
      });
    } else {
      SESSION_HASH = HOME_URL.substr(1, HOME_URL.length - 1);
      SAVE_STATE = true;
    }
  },

  componentDidMount: function () {
    this.initShare();
    $('.smooth-scroll').click(function() {
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
});

module.exports = CPDBApp;
