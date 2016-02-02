var _ = require('lodash');
var React = require('react');
var PropTypes = React.PropTypes;
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var ComplaintSection = require('components/OfficerPage/ComplaintSection.react');
var StoryListAPI = require('utils/StoryListAPI');
var TimelineAPI = require('utils/TimelineAPI');
var TimelineStore = require('stores/OfficerPage/TimelineStore');
var OfficerDetail = require('components/DataToolPage/OfficerDetail.react');
var OfficerPageServerActions = require('actions/OfficerPage/OfficerPageServerActions');
var OfficerPageStore = require('stores/OfficerPageStore');
var RelatedOfficers = require('components/OfficerPage/RelatedOfficers.react');
var StoryList = require('components/OfficerPage/StoryList.react');
var OfficerPresenter = require('presenters/OfficerPresenter');


var OfficerPage = React.createClass({
  propTypes: {
    params: PropTypes.object
  },

  getInitialState: function () {
    return {
      data: {
        officer: {},
        relatedOfficers: [],
        hasMap: false
      },
      timelineData: {}
    };
  },

  componentDidMount: function () {
    var officerId = this.props.params.id || '';
    OfficerPageServerActions.getOfficerData(officerId);
    OfficerPageStore.addChangeListener(this.updateOfficerData);
    TimelineStore.addChangeListener(this.updateTimelineData);
    StoryListAPI.get(officerId);
    TimelineAPI.getTimelineData(officerId);
  },

  componentWillReceiveProps: function (nextProps) {
    // OfficerPage is not rendered again if we change from OfficerPage to other OfficerPage
    var officerId = nextProps.params.id || '';
    OfficerPageServerActions.getOfficerData(officerId);
    StoryListAPI.get(officerId);
    TimelineAPI.getTimelineData(officerId);
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return ((!_.isEqual(nextProps, this.props) || this.stateHasNewUpdates(nextState)));
  },

  componentDidUpdate: function () {
    var officer = this.state.data['officer'];
    document.title = OfficerPresenter(officer).displayName;
  },

  componentWillUnmount: function () {
    OfficerPageStore.removeChangeListener(this.updateOfficerData);
    TimelineStore.removeChangeListener(this.updateTimelineData);
  },

  stateHasNewUpdates: function (nextState) {
    return (
      (_.get(nextState, 'timelineData.items.length') && !_.get(this.state, 'timelineData.items')) ||
      (_.get(nextState, 'data.officer_allegations.length') && !_.get(this.state, 'data.officer_allegations.length')));
  },

  updateOfficerData: function () {
    this.setState({data: OfficerPageStore.getState().data});
  },

  updateTimelineData: function () {
    this.setState({timelineData: TimelineStore.getState().data});
  },

  renderComplaintSection: function (officer) {
    if (officer.discipline_count !== undefined) {
      return <ComplaintSection officer={ officer }/>;
    }
    return <div className='complaint-list-placeholder'/>;
  },

  renderRelatedOfficers: function (relatedOfficers) {
    if (relatedOfficers.length) {
      return <RelatedOfficers relatedOfficers={ relatedOfficers } />;
    }
    return null;
  },

  render: function () {
    var officer = this.state.data['officer'];
    var relatedOfficers = this.state.data['relatedOfficers'];
    var hasMap = this.state.data['has_map'];

    return (
      <div id='officer-profile'>
        <div className='map-row'>
          <div className='container'>
            <OfficerDetail timelineData={ this.state.timelineData } officer={ officer } hasMap={ hasMap }/>
          </div>
        </div>
        <div className='white-background'>
          <div className='container'>
            <ReactCSSTransitionGroup
              transitionName='related-officers'
              transitionEnterTimeout={ 500 }
              transitionLeaveTimeout={ 500 }>
              { this.renderRelatedOfficers(relatedOfficers) }
            </ReactCSSTransitionGroup>
            <StoryList officer={ officer } />
          </div>
        </div>
        <div className='container'>
          <ReactCSSTransitionGroup
            transitionName='complaint-list'
            transitionEnterTimeout={ 500 }
            transitionLeaveTimeout={ 500 }>
            { this.renderComplaintSection(officer) }
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }

});
module.exports = OfficerPage;
