var React = require('react');


var Counter = React.createClass({
  from: 0,

  componentDidUpdate: function () {
    $(this.getDOMNode()).countTo({
      from: this.from,
      to: this.props.to
    });
    this.from = this.props.to
  },

  render: function() {
    return (
      <span></span>
    )
  }

});

module.exports = Counter;
