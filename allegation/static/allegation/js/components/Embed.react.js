/**
 * Created by eastagile on 8/18/15.
 */
var React = require('react');
var Officer = require('./Officer.react');
var OfficerList = require('./OfficerList.react');
var Sunburst = require('./Sunburst.react');
var Map = require('./Map.react');
var Complaint = require('./Complaint.react');
var Summary = require('./Summary.react');


var Embed = React.createClass({
  getInitialState: function () {
    return {
      embed: <div></div>
    }
  },

  setContent: function (content) {
    this.setState({
      embed: content
    });
  },

  renderOfficer: function (officer) {
    this.setContent(<Officer officer={officer} noClick={true} />);
  },

  renderAllegation: function (data) {
    this.setContent(<Complaint complaint={data.allegations[0]} noButton={true} />);
  },

  embedOfficerCard: function () {
    $.getJSON('/api/officers/' + this.props.pk + '/', this.renderOfficer);
  },

  embedOfficers: function () {
    this.setContent(<OfficerList query={this.props.query} noClick={true} />);
  },

  embedSunburst: function () {
    this.setContent(<Sunburst query={this.props.query} selected={this.props.state.name} />);
  },

  embedMap: function () {
    this.setContent(<Map query={this.props.query} center={this.props.state.center}
                         defaultZoom={this.props.state.defaultZoom} />);
  },

  embedAllegation: function () {
    $.getJSON('/api/allegations/?id=' + this.props.pk, this.renderAllegation);
  },

  embedSummary: function () {
    this.setContent(<Summary query={this.props.query} selectedCategories={this.props.state.selectedCategories}
                             currentActive={this.props.state.currentActive} />);
  },

  componentWillMount: function () {
    var listener = {
      'officer-card': this.embedOfficerCard,
      'officers': this.embedOfficers,
      'sunburst': this.embedSunburst,
      'map': this.embedMap,
      'allegation': this.embedAllegation,
      'summary': this.embedSummary
    };

    listener[this.props.page]();
  },

  render: function () {
    return this.state.embed;
  }
});
module.exports = Embed;