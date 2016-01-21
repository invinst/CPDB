var React = require('react');

var DataToolPage = require('components/DataToolPage.react');
var Disclaimer = require('components/DataToolPage/Disclaimer.react');
var IndexTabContentMixin = require('mixins/IndexTabContentMixin');
var LandingFooter = require('components/Shared/LandingFooter.react');
var Nav = require('components/Shared/Nav2.react');
var NavActions = require('actions/NavActions');
var SessionAPI = require('utils/SessionAPI');


var DataPage = React.createClass({
  mixins: [IndexTabContentMixin],

  componentWillMount: function () {
    var session = this.props.params.session;
    var hash = this.props.location.hash;
    if (hash.search("data-tools") != -1) {
      session = hash.split("/")[2];
    }
    SessionAPI.getSessionInfo(session || '');
  },

  componentDidMount: function () {
    NavActions.initDataTool();
    var $body = $('body');

    $body.animate({
      scrollTop: 0
    }, 100);
  },

  render: function () {
  	return (
  		<div id="landing-page" className='scroll-to-top'>
          <div className="landing-page fixed-nav">
            <Nav displayTitleBox={true} page='data'/>
          </div>

          <div className="main">
            <div className="tab-content">
              <div role="tabpanel" className={this.getPanelClass('data')} id="data">
                <DataToolPage />
              </div>
            </div>
          </div>

          <div className="landing-page">
            <LandingFooter />
          </div>
          <Disclaimer />
        </div>
		)
  }
});

module.exports = DataPage;
