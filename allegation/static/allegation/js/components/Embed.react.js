/**
 * Created by eastagile on 8/18/15.
 */
var React = require('react');
var Officer = require('./Officer.react');
var OfficerList = require('./OfficerList.react');
var Sunburst = require('./Sunburst.react');
var Map = require('./Map.react');


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

  componentWillMount: function () {
    var listener = {
      'officer-card': this.embedOfficerCard,
      'officers': this.embedOfficers,
      'sunburst': this.embedSunburst,
      'map': this.embedMap
    };

    listener[this.props.page]();
  },

  render: function () {
    return this.state.embed;
  }
});
module.exports = Embed;
