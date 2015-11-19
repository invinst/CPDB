var navigate = require('react-mini-router').navigate;
var React = require('react');

var Back = require('components/Shared/Back.react');
var Logo = require('components/Shared/Logo.react');
var Search = require('components/Shared/Search.react');
var SessionStore = require('stores/SessionStore');
var SiteTitle = require('components/Shared/SiteTitle.react');


var Nav = React.createClass({
  render: function() {
    return (
      <nav className="landing-nav">
        <div className="items clearfix">
          <img className="pull-left cpdp-logo" src="/static/img/cpdp-logo.svg" />
          <Back />
        </div>
      </nav>
    )
  }
});

module.exports = Nav;
