var React = require('react');
var cx = require('classnames');

var Back = React.createClass({
  render: function() {
    var classNames = cx({'hidden': history.length < 3}, 'pointer', 'back-button');
    return (
      <span onClick={ this._onClick } className={ classNames }>
        <i className='fa fa-arrow-circle-o-left'></i>
        Back
      </span>
    );
  },

  _onClick: function() {
    history.go(-1);
  }
});

module.exports = Back;
