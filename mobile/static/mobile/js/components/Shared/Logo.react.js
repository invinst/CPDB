var React = require('react');


var Logo = React.createClass({
  render: function () {
    return (
      <div id='logo' className='animation'>
        <div className='box animation'>
          CPDP
        </div>
      </div>
    )
  }
});

module.exports = Logo;
