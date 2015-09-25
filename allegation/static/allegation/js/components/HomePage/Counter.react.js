var React = require('react');
var numeral = require('numeral');
var AppConstants = require('../constants/AppConstants');


var Counter = React.createClass({
  from: 0,

  componentDidUpdate: function () {
    $(this.getDOMNode()).countTo({
      from: this.from,
      to: this.props.to,
      refreshInterval: 20,
      formatter: function (value, options) {
        return numeral(value).format(AppConstants.NUMERAL_FORMAT);
      }
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
