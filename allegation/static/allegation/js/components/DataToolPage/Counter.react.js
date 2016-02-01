var React = require('react');
var PropTypes = React.PropTypes;
var ReactDOM = require('react-dom');
var numeral = require('numeral');
var AppConstants = require('constants/AppConstants');


var Counter = React.createClass({
  propTypes: {
    to: PropTypes.number
  },

  componentDidMount: function () {
    this.runCounter();
  },

  componentDidUpdate: function () {
    this.runCounter();
  },

  from: 0,

  runCounter: function () {
    $(ReactDOM.findDOMNode(this)).countTo({
      from: this.from,
      to: this.props.to,
      refreshInterval: 20,
      formatter: function (value, options) {
        return numeral(value).format(AppConstants.NUMERAL_FORMAT);
      }
    });
    this.from = this.props.to;
  },

  render: function () {
    return (
      <span></span>
    );
  }

});

module.exports = Counter;
