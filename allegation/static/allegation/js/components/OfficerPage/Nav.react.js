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
        <div className="navbar-header">
          <Logo />
        </div>
        <div className="navbar-collapse collapse" id="navbar-main">
          <ul className="nav navbar-nav">
            <li className='site-title'>
              <SiteTitle editable={false}/>
            </li>
          </ul>
          <Back />
        </div>
      </div>
    )
  }
});

module.exports = Nav;
