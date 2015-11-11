var _ = require('lodash');
var classnames = require('classnames');
var isMobile = require('ismobilejs');
var navigate = require('react-mini-router').navigate;
var React = require('react');

var Base = require('components/Base.react');
var Logo = require('components/Shared/Logo.react');
var SessionStore = require('stores/SessionStore');
var SiteTitle = require('components/Shared/SiteTitle.react');
var SiteLinks = require('components/Shared/SiteLinks.react');
var NavStore = require('stores/NavStore');


var Nav = React.createClass(_.assign(Base(NavStore), {
  render: function() {
    var mobileExpanded = isMobile.any && this.state.searchExpanded;
    var leftColClass = classnames(
      {
        'col-xs-3': mobileExpanded,
        'col-xs-11': !mobileExpanded
      },
      'col-sm-7'
    );

    var navbarClass = classnames(
      'navbar-collapse',
      {
        'hidden': mobileExpanded
      }
    );

    return (
      <div className="navbar navbar-default">
        <div className="container-fluid">
          <div className="row">
            <div className={leftColClass}>
              <div className="navbar-header">
                <Logo />
              </div>
              <div className={navbarClass} id="navbar-main">
                <ul className="nav navbar-nav">
                  <li className='site-title'>
                    <SiteTitle changable={true} />
                  </li>
                </ul>
              </div>
            </div>
            <div className='col-md-4 col-sm-5 hidden-xs site-links-wrapper pull-right'>
              <SiteLinks />
            </div>
          </div>
        </div>
      </div>
    )
  }
}));

module.exports = Nav;
