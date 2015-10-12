var React = require('react');

var Back = React.createClass({
  render: function() {
    return (
      <span onClick={this._onClick} className='back-button pointer pull-right'>Back</span>
    )
  },

  _onClick: function() {
    history.go(-1);
  }
});

module.exports = Back;
