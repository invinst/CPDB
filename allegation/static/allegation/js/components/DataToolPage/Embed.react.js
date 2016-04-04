var React = require('react');
var PropTypes = React.PropTypes;

var Officer = require('components/DataToolPage/Officer.react');
var OfficerList = require('components/DataToolPage/OfficerList.react');
var Sunburst = require('components/DataToolPage/Sunburst.react');
var Map = require('components/DataToolPage/Map.react');
var Complaint = require('components/DataToolPage/Complaint.react');
var RaceGenderAPI = require('utils/RaceGenderAPI');
var RaceGenderAgeTab = require('components/DataToolPage/RaceGenderAgeTab.react');
var Summary = require('components/DataToolPage/Summary.react');
var SunburstAPI = require('utils/SunburstAPI');

var Embed = React.createClass({
  propTypes: {
    page: PropTypes.string,
    pk: PropTypes.string,
    query: PropTypes.string,
    state: PropTypes.string
  },

  getInitialState: function () {
    return {
      embed: <div></div>
    };
  },

  componentWillMount: function () {
    var listener = {
      'officer-card': this.embedOfficerCard,
      'officers': this.embedOfficers,
      'sunburst': this.embedSunburst,
      'map': this.embedMap,
      'allegation': this.embedAllegation,
      'summary': this.embedSummary,
      'officer-race-gender-age-tab': this.embedOfficerRaceGender,
      'complainant-race-gender-age-tab': this.embedComplainantRaceGender
    };

    listener[this.props.page]();
  },

  setContent: function (content) {
    this.setState({
      embed: content
    });
  },

  embedAllegation: function () {
    $.getJSON('/api/officer-allegations/?id=' + this.props.pk, this.renderAllegation);
  },

  embedMap: function () {
    this.setContent(
      <Map query={ this.props.query } center={ this.props.state.center }
        defaultZoom={ this.props.state.defaultZoom } />
    );
  },

  embedOfficerCard: function () {
    $.getJSON('/api/officers/' + this.props.pk + '/', this.renderOfficer);
  },

  embedOfficers: function () {
    this.setContent(<OfficerList query={ this.props.query } noClick={ true } />);
  },

  embedOfficerRaceGender: function () {
    this.setContent(<RaceGenderAgeTab role={ RaceGenderAgeTab.OFFICER_ROLE } />);
    RaceGenderAPI.getData(this.props.query);
  },

  embedComplainantRaceGender: function () {
    this.setContent(<RaceGenderAgeTab role={ RaceGenderAgeTab.COMPLAINANT_ROLE } />);
    RaceGenderAPI.getData(this.props.query);
  },

  embedSummary: function () {
    this.setContent(
      <Summary query={ this.props.query } selectedCategories={ this.props.state.selectedCategories }
        currentActive={ this.props.state.currentActive } />
    );
  },

  embedSunburst: function () {
    this.setContent(<Sunburst selected={ this.props.state.name } />);
    SunburstAPI.getData(this.props.query);
  },

  renderAllegation: function (data) {
    this.setContent(<Complaint complaint={ data.allegations[0] } noButton={ true } />);
  },

  renderOfficer: function (officer) {
    this.setContent(<Officer officer={ officer } noClick={ true } />);
  },

  render: function () {
    return this.state.embed;
  }
});
module.exports = Embed;
