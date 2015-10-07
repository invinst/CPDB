var _ = require('lodash');
var navigate = require('react-mini-router').navigate;
var React = require('react');

var Base = require('components/Base.react');
var ComplaintSection = require('components/HomePage/OfficerPage/ComplaintSection.react');
var ComplaintListAPI = require('utils/ComplaintListAPI');
var FilterActions = require("actions/FilterActions");
var OfficerDetail = require('components/HomePage/OfficerDetail.react');
var OfficerPageServerActions = require('actions/OfficerPage/OfficerPageServerActions');
var OfficerPageStore = require('stores/OfficerPageStore');
var RelatedOfficers = require('components/HomePage/OfficerPage/RelatedOfficers.react');
var SessionStore = require('stores/SessionStore');
var StoryList = require('components/HomePage/OfficerPage/StoryList.react');


var OfficerPage = React.createClass(_.assign(Base(OfficerPageStore), {
  componentDidMount: function() {
    var officerId = this.props.officerId || '';
    OfficerPageServerActions.getOfficerData(officerId);
    OfficerPageStore.addChangeListener(this._onChange);
  },

  componentWillReceiveProps: function(nextProps) {
    // OfficerPage is not rendered again if we change from OfficerPage to other OfficerPage
    var officerId = nextProps.officerId || '';
    OfficerPageServerActions.getOfficerData(officerId);
    ComplaintListAPI.getAllForOfficer(officerId);
  },

  render: function () {
    var allegations = this.state.data['allegations'];
    var officer = this.state.data['officer'];
    var relatedOfficers = this.state.data['related_officers'];
    var hasMap = this.state.data['has_map'];

    if (_.isEmpty(officer)) {
      return <i class="fa fa-spin fa-spinner" />;
    }
    return (
      <div>
        <div className="navbar navbar-default">
            <div className="navbar-header">
                <a href="#" onClick={this._onLogoClick} className="navbar-brand">
                    <img src="/static/img/logo.png" alt="" />
                </a>
                <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
            </div>
        </div>
        <div id='officer-profile'>
          <div className="map-row">
            <div className="container">
              <OfficerDetail officer={officer} hasMap={hasMap} />
            </div>
          </div>
          <div className="container">
            <RelatedOfficers relatedOfficers={relatedOfficers} />
            <StoryList officer={officer} />
            <ComplaintSection officer={officer}/>
          </div>
        </div>
      </div>
    );
  },

  _onLogoClick: function(e) {
    e.preventDefault();
    var hash = SessionStore.getHash();
    navigate('/data-tools/' + hash);
  }

}));
module.exports = OfficerPage;
