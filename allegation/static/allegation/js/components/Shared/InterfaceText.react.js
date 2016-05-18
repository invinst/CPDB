var React = require('react');
var PropTypes = React.PropTypes;

var InterfaceTextUtil = require('utils/InterfaceTextUtil');


var InterfaceText = React.createClass({
  propTypes: {
    identifier: PropTypes.string
  },

  render: function () {
    var text = InterfaceTextUtil.get(this.props.identifier);

    return (
      <div>{ text }</div>
    );
  }
});

module.exports = InterfaceText;
