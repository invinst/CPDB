var React = require('react');
var cx = require('classnames');

var About = React.createClass({
  propTypes: {
    topLeft: React.PropTypes.number
  },

  render: function () {
    var classNames = cx('animation bold', {'top-left': this.props.topLeft});
    return (
      <div id='about' className={ classNames }>
        About the data
      </div>
    );
  }
});

module.exports = About;
