var React = require('react');
var Filters = require('components/HomePage/Filters.react');
var MapStore = require('stores/MapStore');
var FilterAction = require('actions/FilterActions');
var OfficerList = require('components/HomePage/OfficerList.react');
var ComplaintSection = require('components/HomePage/ComplaintSection.react');
var DistributionChart = require('components/HomePage/DistributionChart.react');
var Map = require('components/HomePage/Map.react');
var EmbedBar = require('components/HomePage/Embed/Bar.react');
var Tabs = require('components/HomePage/Tabs.react');


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
    );
  }
});

module.exports = CPDBApp;
