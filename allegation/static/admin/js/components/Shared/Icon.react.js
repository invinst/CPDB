var React = require('react');

var Icon = React.createClass({
  render: function() {
    var icon = this.props.icon;
    icon = 'fa fa-' + icon;

    if ('size' in this.props) {
      icon += " " + this.props.size;
    }

    return (
      <i className={icon} />
    )
  }
});

module.exports = Icon;
