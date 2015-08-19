/**
 * Created by eastagile on 8/18/15.
 */
var React = require('react');
var Officer = require('./Officer.react');

var Embed = React.createClass({
  getInitialState: function () {
    return {
      embed: <div></div>
    }
  },
  componentWillMount: function () {
    var that = this;
    if (this.props.page == 'officer-card') {
      $.getJSON('/api/officers/' + that.props.pk + '/', function (officer) {
        that.setState({
          embed: <Officer officer={officer} noClick={true} />
        });
      });
    }
  },
  render: function () {
    return this.state.embed;
  }
});
module.exports = Embed;
