var _ = require('lodash');
var classnames = require('classnames');
var isMobile = require('ismobilejs');
var navigate = require('react-mini-router').navigate;
var React = require('react');

var Base = require('components/Base.react');
var Logo = require('components/Shared/Logo.react');
var Search = require('components/Shared/Search.react');
var SessionStore = require('stores/SessionStore');
var SiteTitle = require('components/Shared/SiteTitle.react');
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
    var rightColClass = classnames(
      {
        'col-xs-9': mobileExpanded,
        'col-xs-1': !mobileExpanded
      },
      'col-sm-5'
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
            <div className={rightColClass}>
              <Search mobileExpanded={mobileExpanded} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}));

module.exports = Nav;
