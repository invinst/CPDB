var navigate = require('react-mini-router').navigate;
var React = require('react');

var SessionStore = require('stores/SessionStore');

var Logo = React.createClass({
  _onClick: function (e) {
    var url = ['/data-tools', SessionStore.getHash()].join('/');
    e.preventDefault();
    navigate(url);
  },

  render: function () {
    return (
      <a href='/landing' className='navbar-brand pointer'>
        <img src='/static/img/logo.png' alt='CPDB Logo'/>
      </a>
    );
  }
});

module.exports = Logo;
