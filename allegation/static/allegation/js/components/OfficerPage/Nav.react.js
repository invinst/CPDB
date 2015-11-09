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
      <div className="navbar navbar-default">
        <div className="container-fluid">
          <div className="row">
            <div className='col-xs-11 col-sm-7'>
              <div className="navbar-header">
                <Logo />
              </div>
              <div className="navbar-collapse" id="navbar-main">
                <Back />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Nav;
