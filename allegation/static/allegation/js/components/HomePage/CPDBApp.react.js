var _ = require('lodash');
var React = require('react');

var AppConstants = require('constants/AppConstants');
var Base = require('components/Base.react');
var ComplaintSection = require('components/HomePage/ComplaintSection.react');
var EmbedBar = require('components/HomePage/Embed/Bar.react');
var Filters = require('components/HomePage/Filters.react');
var Map = require('components/HomePage/Map.react');
var OfficerList = require('components/HomePage/OfficerList.react');
var SessionAPI = require('utils/SessionAPI');
var SessionStore = require('stores/SessionStore');
var Tabs = require('components/HomePage/Tabs.react');
var Nav = require('components/Shared/Nav.react');


var CPDBApp = React.createClass(_.assign(Base(SessionStore), {
  componentDidMount: function () {
    var session = this.props.session || '';
    SessionAPI.getSessionInfo(session);

    $('.smooth-scroll').click(function() {
      var target = $(this).data('target');
      var top = $(target).offset().top - 100;
      $("html, body").animate({scrollTop: top}, 500);
    })
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
