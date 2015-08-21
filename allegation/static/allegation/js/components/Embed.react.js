/**
 * Created by eastagile on 8/18/15.
 */
var React = require('react');
var Officer = require('./Officer.react');
var OfficerList = require('./OfficerList.react');
var Sunburst = require('./Sunburst.react');
var Map = require('./Map.react');
var Complaint = require('./Complaint.react');


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
    this.setContent(<Sunburst query={this.props.query} />);
  },

  embedMap: function () {
    this.setContent(<Map query={this.props.query} />);
  },

  embedAllegation: function () {
    $.getJSON('/api/allegations/?id=' + this.props.pk, this.renderAllegation);
  },

  componentWillMount: function () {
    var listener = {
      'officer-card': this.embedOfficerCard,
      'officers': this.embedOfficers,
      'sunburst': this.embedSunburst,
      'map': this.embedMap,
      'allegation': this.embedAllegation
    };

    listener[this.props.page]();
  },

  render: function () {
    return this.state.embed;
  }
});
module.exports = Embed;
