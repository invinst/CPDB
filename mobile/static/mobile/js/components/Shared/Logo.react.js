var React = require('react');
var cx = require('classnames');

var Logo = React.createClass({
  render: function () {
    var classNames = cx('animation', 'pad', { 'top-left': this.props.topLeft });

    return (
      <div id='logo' className={classNames}>
        <div className='box animation'>
          CPDP
        </div>
      </div>
    )
  }
});

module.exports = Logo;
