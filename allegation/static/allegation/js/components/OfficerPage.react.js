var _ = require('lodash');
var navigate = require('react-mini-router').navigate;
var React = require('react');

var Base = require('components/Base.react');
var ComplaintSection = require('components/OfficerPage/ComplaintSection.react');
var ComplaintListAPI = require('utils/ComplaintListAPI');
var FilterActions = require("actions/FilterActions");
var Nav = require('components/OfficerPage/Nav.react');
var OfficerDetail = require('components/DataToolPage/OfficerDetail.react');
var OfficerPageServerActions = require('actions/OfficerPage/OfficerPageServerActions');
var OfficerPageStore = require('stores/OfficerPageStore');
var RelatedOfficers = require('components/OfficerPage/RelatedOfficers.react');
var SessionStore = require('stores/SessionStore');
var StoryList = require('components/OfficerPage/StoryList.react');


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
        <Nav dataLink={true} />
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
    navigate('/data-tools' + SessionStore.getUrl());
  }

}));
module.exports = OfficerPage;
