var navigate = require('react-mini-router').navigate;
var React = require('react');

var SessionStore = require('stores/SessionStore');

var Logo = React.createClass({
  render: function() {
    return (
      <a href="/landing" className="navbar-brand pointer">
        <img src="/static/img/logo.png" alt="CPDB Logo"/>
      </a>
    )
  },

  _onClick: function(e) {
    e.preventDefault();
    var url = ['/data-tools', SessionStore.getHash()].join('/');
    navigate(url);
  }
});

module.exports = Logo;
