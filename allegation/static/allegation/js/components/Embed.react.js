/**
 * Created by eastagile on 8/18/15.
 */
var React = require('react');
var Officer = require('./Officer.react');
var OfficerList = require('./OfficerList.react');
var Sunburst = require('./Sunburst.react');

var SunburstStore = require("../stores/SunburstStore");


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

  renderOfficers: function (data) {
    this.setContent(<OfficerList data={data} noClick={true} />);
  },

  renderSunburst: function (data) {
    this.setContent(<Sunburst />);
    SunburstStore.setData(data);
  },

  embedOfficerCard: function () {
    $.getJSON('/api/officers/' + this.props.pk + '/', this.renderOfficer);
  },

  embedOfficers: function () {
    $.getJSON('/api/allegations/officers/?' + this.props.query + '/', this.renderOfficers);
  },

  embedSunburst: function () {
     $.getJSON('/api/allegations/sunburst/?' + this.props.query + '/', this.renderSunburst);
  },

  componentWillMount: function () {
    var listener = {
      'officer-card': this.embedOfficerCard,
      'officers': this.embedOfficers,
      'sunburst': this.embedSunburst
    };

    listener[this.props.page]();
  },

  render: function () {
    return this.state.embed;
  }
});
module.exports = Embed;
