var React = require('react');


var HelpText = React.createClass({
  render: function() {
    var placement = this.props.placement ? this.props.placement : 'right';
    var text = INTERFACE_TEXTS[this.props.identifier] ? INTERFACE_TEXTS[this.props.identifier] : "Not set in admin: '" + this.props.identifier +"'";
    return (
      <span className='fa fa-question-circle' data-toggle="tooltip" data-placement={placement} title={text}></span>
    )
  },
  componentDidMount: function () {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    });
  }

});

module.exports = HelpText;
