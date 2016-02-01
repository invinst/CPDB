var React = require('react');
var PropTypes = React.PropTypes;


var Icon = React.createClass({
  propTypes: {
    icon: PropTypes.string,
    size: PropTypes.string
  },

  render: function () {
    var icon = this.props.icon;
    icon = 'fa fa-' + icon;

    if ('size' in this.props) {
      icon += ' ' + this.props.size;
    }

    return (
      <i className={ icon } />
    );
  }
});

module.exports = Icon;
