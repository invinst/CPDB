var _ = require('lodash');
var classnames = require('classnames');
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Base = require('components/Base.react');
var ComplaintSection = require('components/OfficerPage/ComplaintSection.react');
var ComplaintListAPI = require('utils/ComplaintListAPI');
var StoryListAPI = require('utils/StoryListAPI');
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
    var officerId = this.props.params.id || '';
    OfficerPageServerActions.getOfficerData(officerId);
    OfficerPageStore.addChangeListener(this._onChange);
    StoryListAPI.get(officerId);
  },

  componentWillReceiveProps: function(nextProps) {
    // OfficerPage is not rendered again if we change from OfficerPage to other OfficerPage
    var officerId = nextProps.params.id || '';
    OfficerPageServerActions.getOfficerData(officerId);
    StoryListAPI.get(officerId);
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

    var content = '';
    if (_.isEmpty(officer)) {
      content = (<i className='fa fa-spin fa-spinner' />);
    } else {
      content = (
        <div key='content'>
          <Nav />
          <div id='officer-profile'>
            <div className="map-row">
              <div className="container">
                <OfficerDetail officer={officer} hasMap={hasMap} />
              </div>
            </div>
            <div className="white-background">
              <div className="container">
                <RelatedOfficers relatedOfficers={relatedOfficers} />
                <StoryList officer={officer} />
              </div>
            </div>
            <div className="container">
              <ComplaintSection officer={officer}/>
            </div>
            <div className='container-fluid'>
              <div className='sticky-footer'>
                <Footer />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div id='officer-page'>
        <ReactCSSTransitionGroup transitionName="officer-page" transitionEnterTimeout={500}>
          {content}
          <Disclaimer key='disclaimer' />
          <HappyFox key='happyfox' />
        </ReactCSSTransitionGroup>
      </div>
    );
  },

  _onLogoClick: function(e) {
    e.preventDefault();
    navigate('/data-tools' + SessionStore.getUrl());
  }

}));
module.exports = OfficerPage;
