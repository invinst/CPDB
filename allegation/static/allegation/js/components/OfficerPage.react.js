var _ = require('lodash');
var classnames = require('classnames');
var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var ComplaintSection = require('components/OfficerPage/ComplaintSection.react');
var StoryListAPI = require('utils/StoryListAPI');
var TimelineAPI = require('utils/TimelineAPI');
var TimelineStore = require('stores/OfficerPage/TimelineStore');
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


var OfficerPage = React.createClass({
  getInitialState: function() {
    return {
      data: {
        allegations: [],
        officer: {},
        relatedOfficers: [],
        hasMap: false
      },
      timelineData: {}
    }
  },

  componentDidMount: function() {
    var officerId = this.props.params.id || '';
    OfficerPageServerActions.getOfficerData(officerId);
    OfficerPageStore.addChangeListener(this.updateOfficerData);
    TimelineStore.addChangeListener(this.updateTimelineData);
    StoryListAPI.get(officerId);
    TimelineAPI.getTimelineData(officerId);
  },

  componentWillUnmount: function () {
    OfficerPageStore.removeChangeListener(this.updateOfficerData);
    TimelineStore.removeChangeListener(this.updateTimelineData);
  },

  updateOfficerData: function () {
    if (this.isMounted()) {
      this.setState({data: OfficerPageStore.getState().data});
    }
  },

  updateTimelineData: function () {
    if (this.isMounted()) {
      this.setState({timelineData: TimelineStore.getState().data});
    }
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

  stateHasNewUpdates: function (nextState) {
    return (
      (_.get(nextState, 'timelineData.items.length') && !_.get(this.state, 'timelineData.items')) ||
      (_.get(nextState, 'data.allegations.length') && !_.get(this.state, 'data.allegations.length')));
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return (nextProps.transitioning === false &&
      (!_.isEqual(nextProps, this.props) || this.stateHasNewUpdates(nextState)));
  },

  render: function () {
    var allegations = this.state.data['allegations'];
    var officer = this.state.data['officer'];
    var relatedOfficers = this.state.data['relatedOfficers'];
    var hasMap = this.state.data['has_map'];
    var content;

    content = (
      <div>
        <Nav />
        <div id='officer-profile'>
          <div className="map-row">
            <div className="container">
              <OfficerDetail timelineData={this.state.timelineData} officer={officer} hasMap={hasMap}/>
            </div>
          </div>
          <div className="white-background">
            <div className="container">
              <ReactCSSTransitionGroup
                  transitionName="related-officers"
                  transitionEnterTimeout={500}
                  transitionLeaveTimeout={500}>
                {relatedOfficers.length
                  ? <RelatedOfficers relatedOfficers={relatedOfficers} />
                  : null
                }
              </ReactCSSTransitionGroup>
              <StoryList officer={officer} />
            </div>
          </div>
          <div className="container">
            <ReactCSSTransitionGroup
                transitionName="complaint-list"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}>
              {officer.discipline_count !== undefined
                ? <ComplaintSection officer={officer}/>
                : <div className="complaint-list-placeholder"/>
              }
            </ReactCSSTransitionGroup>
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

});
module.exports = OfficerPage;
