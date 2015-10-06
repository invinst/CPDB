var HOST = 'http://localhost:8000';
var React = require('react');

var ComplaintSection = require('components/HomePage/OfficerPage/ComplaintSection.react');
var FilterActions = require("actions/FilterActions");
var OfficerDetail = require('components/HomePage/OfficerDetail.react');

var RelatedOfficers = require('components/HomePage/OfficerPage/RelatedOfficers.react');
var StoryList = require('components/HomePage/OfficerPage/StoryList.react');
var OfficerPageServerActions = require('actions/OfficerPage/OfficerPageServerActions');
var OfficerPageStore = require('stores/OfficerPageStore');
var Base = require('components/Base.react');
var _ = require('lodash');

var OfficerPage = React.createClass(_.assign(Base(OfficerPageStore), {
  componentDidMount: function() {
    var officerId = this.props.officerId || '';
    OfficerPageServerActions.getOfficerData(officerId);
    OfficerPageStore.addChangeListener(this._onChange);
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
                <a href="/" className="navbar-brand">
                    <img src="" alt="" />
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

}));
module.exports = OfficerPage;
