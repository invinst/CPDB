var _ = require('lodash');
var React = require('react');
var PropTypes = React.PropTypes;

var Base = require('components/Base.react');
var Location = require('components/DataToolPage/Complaint/Location.react');
var OfficerList = require('components/DataToolPage/Complaint/OfficerList.react');
var PoliceWitness = require('components/DataToolPage/Complaint/PoliceWitness.react');
var Timeline = require('components/DataToolPage/Complaint/Timeline.react');
var AllegationDetailsStore = require('stores/Complaint/AllegationDetailsStore');
var AllegationAPI = require('utils/AllegationAPI');
var ReadMore = require('components/Shared/ReadMore.react');
var HelpText = require('components/Shared/HelpText.react');


var AllegationDetails = React.createClass(_.assign(Base(AllegationDetailsStore), {
  propTypes: {
    allegation: PropTypes.object.isRequired
  },

  componentDidMount: function () {
    AllegationDetailsStore.addChangeListener(this._onChange);
    AllegationAPI.getData(this.props.allegation.allegation.crid);
  },

  renderOfficersInvolved: function (allegation) {
    return (
      <div className='row officers'>
        <OfficerList allegation={ allegation } />
      </div>
    );
  },

  renderSummary: function (allegation) {
    var summary = allegation.allegation.summary;

    if (summary) {
      return (
        <div className='row'>
          <div className='col-xs-12 col-md-10'>
            <div className='section-title'>
              Case Summary <HelpText identifier='summary-help-text' />
            </div>
            <div className='section-summary'>
              <ReadMore limit={ 5 } content={ summary } />
            </div>
          </div>
        </div>
      );
    }
    return '';
  },

  renderTimeline: function (allegation) {
    var _allegation = allegation.allegation;

    if (_allegation['start_date'] || _allegation['incident_date'] || _allegation['end_date']) {
      return (
        <div className='row'>
          <Timeline complaint={ allegation } />
        </div>
      );
    }
    return '';
  },

  renderLocation: function (allegation) {
    if (allegation.allegation.point.lat) {
      return (
        <div className='row'>
          <Location complaint={ allegation } />
        </div>
      );
    }
    return '';
  },

  renderPoliceWitness: function (allegation) {
    if (_.get(this.state, 'police_witness.length', 0)) {
      return (
        <PoliceWitness complaint={ allegation } witnesses={ this.state['police_witness'] } />
      );
    }
    return '';
  },

  render: function () {
    var allegation = this.props.allegation;

    return (
      <div className='allegation-details'>
        { this.renderOfficersInvolved(allegation) }
        { this.renderSummary(allegation) }
        { this.renderTimeline(allegation) }
        { this.renderLocation(allegation) }
        { this.renderPoliceWitness(allegation) }
      </div>
    );
  }
}));

module.exports = AllegationDetails;
