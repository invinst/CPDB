var React = require('react');
var ReactToolTip = require('react-tooltip');


var HelpText = React.createClass({
  render: function() {
    var placement = this.props.placement ? this.props.placement : 'right';
    var text = INTERFACE_TEXTS[this.props.identifier] ? INTERFACE_TEXTS[this.props.identifier] : 'Not set in admin: \'' + this.props.identifier +'\'';
    return (
      <span className='fa fa-question-circle' data-tip={ text }><ReactToolTip /></span>
    );
  }
});

module.exports = HelpText;
