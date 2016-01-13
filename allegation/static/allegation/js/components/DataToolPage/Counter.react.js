var React = require('react');
var ReactDOM = require('react-dom');
var numeral = require('numeral');
var AppConstants = require('constants/AppConstants');


var Counter = React.createClass({
  from: 0,

  componentDidMount: function () {
    this.runCounter();
  },

  componentDidUpdate: function () {
    this.runCounter();
  },

  runCounter: function () {
    $(ReactDOM.findDOMNode(this)).countTo({
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
