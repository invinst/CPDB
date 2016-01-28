var navigate = require('react-mini-router').navigate;
var React = require('react');
var ReactRouter = require('react-router');

var Link = ReactRouter.Link;

var Back = require('components/Shared/Back.react');
var Logo = require('components/Shared/Logo.react');
var Search = require('components/Shared/Search.react');
var AppStore = require('stores/AppStore');
var SessionStore = require('stores/SessionStore');
var SiteTitle = require('components/Shared/SiteTitle.react');


var Nav = React.createClass({
  render: function() {
    var dataToolUrl = AppStore.getDataToolUrl();

    return (
      <nav className="landing-nav">
        <div className="items clearfix">
          <Link to={ dataToolUrl }><img className="pull-left cpdp-logo" src="/static/img/cpdp-logo.svg" /></Link>
          <Back />
        </div>
      </nav>
    );
  }
});

module.exports = Nav;
