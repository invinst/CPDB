/**
 * Created by eastagile on 8/6/15.
 */
var React = require('react');

var Button = React.createClass({
  getInitialState: function () {
    return {};
  },

  onClick: function (e) {
    e.preventDefault();
  },

  render: function () {
    return (
      <a href="#" onClick={this.onClick}>
        <i className="fa fa-code"></i> Embed Mode
      </a>
    );
  }
});

module.exports = Button;
