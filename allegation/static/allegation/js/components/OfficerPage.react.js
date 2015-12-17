var _ = require('lodash');
var classnames = require('classnames');
var React = require('react');

var Base = require('components/Base.react');
var ComplaintSection = require('components/OfficerPage/ComplaintSection.react');
var ComplaintListAPI = require('utils/ComplaintListAPI');
var StoryListAPI = require('utils/StoryListAPI');
var TimelineAPI = require('utils/TimelineAPI');
var FilterActions = require("actions/FilterActions");
var Nav = require('components/OfficerPage/Nav.react');
var OfficerDetail = require('components/DataToolPage/OfficerDetail.react');
var OfficerPageServerActions = require('actions/OfficerPage/OfficerPageServerActions');
var OfficerPageStore = require('stores/OfficerPageStore');
var RelatedOfficers = require('components/OfficerPage/RelatedOfficers.react');
var SessionStore = require('stores/SessionStore');
var StoryList = require('components/OfficerPage/StoryList.react');
var OfficerPresenter = require('presenters/OfficerPresenter');
var Disclaimer = require('components/DataToolPage/Disclaimer.react');
var Footer = require('components/DataToolPage/Footer.react');
var HappyFox = require('components/Shared/HappyFox.react');


var OfficerPage = React.createClass(_.assign(Base(OfficerPageStore), {
  getInitialState: function() {
    return {
      data: {
        allegations: [],
        officer: {},
        relatedOfficers: [],
        hasMap: false
      }
    }
  },

  componentDidMount: function() {
    var officerPage = this;
    var officerId = this.props.params.id || '';

    setTimeout(function () {
      OfficerPageServerActions.getOfficerData(officerId);
      OfficerPageStore.addChangeListener(officerPage._onChange);
      StoryListAPI.get(officerId);
      TimelineAPI.getTimelineData(officerId);
    }, 500);
  },

  componentWillReceiveProps: function(nextProps) {
    // OfficerPage is not rendered again if we change from OfficerPage to other OfficerPage
    var officerId = nextProps.params.id || '';
    OfficerPageServerActions.getOfficerData(officerId);
    StoryListAPI.get(officerId);
    TimelineAPI.getTimelineData(officerId);
  },

  componentDidUpdate: function () {
    var officer = this.state.data['officer'];
    document.title = OfficerPresenter(officer).displayName;
  },

  render: function () {
    var allegations = this.state.data['allegations'];
    var officer = this.state.data['officer'];
    var relatedOfficers = this.state.data['related_officers'];
    var hasMap = this.state.data['has_map'];

    var waitComponent = (<div className='wait-placeholder'><i className='fa fa-spinner fa-spin'></i></div>);
    var officerDetailComponent = waitComponent;
    var relatedOfficersComponent = waitComponent;
    var storyListComponent = waitComponent;
    var complaintSectionComponent = waitComponent;
    if (!_.isEmpty(officer)) {
      officerDetailComponent = (<OfficerDetail officer={officer} hasMap={hasMap} />);
      relatedOfficersComponent = (<RelatedOfficers relatedOfficers={relatedOfficers} />);
      storyListComponent = (<StoryList officer={officer} />);
      complaintSectionComponent = (<ComplaintSection officer={officer}/>);
    }

    var content = (
      <div>
        <Nav />
        <div id='officer-profile'>
          <div className="map-row">
            <div className="container">
              {officerDetailComponent}
            </div>
          </div>
          <div className="white-background">
            <div className="container">
              {relatedOfficersComponent}
              {storyListComponent}
            </div>
          </div>
          <div className="container">
            {complaintSectionComponent}
          </div>
          <div className='container-fluid'>
            <div className='sticky-footer'>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        {content}
        <Disclaimer />
        <HappyFox />
      </div>
    );
  },

  _onLogoClick: function(e) {
    e.preventDefault();
    navigate('/data-tools' + SessionStore.getUrl());
  }

}));
module.exports = OfficerPage;
