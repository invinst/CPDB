var React = require('react');
var PropTypes = React.PropTypes;
var ReactToolTip = require('react-tooltip');


var HelpText = React.createClass({
  propTypes: {
    identifier: PropTypes.string
  },

  render: function () {
    var text = INTERFACE_TEXTS[this.props.identifier] ?
      INTERFACE_TEXTS[this.props.identifier] : 'Not set in admin: \'' + this.props.identifier +'\'';
    return (
      <span className='fa fa-question-circle' data-tip={ text }><ReactToolTip /></span>
    );
  }
});

module.exports = HelpText;
