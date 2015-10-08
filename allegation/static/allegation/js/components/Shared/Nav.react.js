var React = require('react');
var SiteTitle = require('components/Shared/SiteTitle.react');

var Nav = React.createClass({
  render: function() {
    return (
      <div className="navbar navbar-default">
        <div className="navbar-header">
          <a href="/" className="navbar-brand">
            <img src="" alt=""/>
          </a>
          <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        </div>
        <div className="navbar-collapse collapse" id="navbar-main">
          <ul className="nav navbar-nav">
            <li className='site-title'>
              <SiteTitle />
            </li>
          </ul>
          <form className="navbar-form navbar-right" role="search">
            <div id="search-wrapper">
              <input type="text" id="autocomplete" placeholder="Search by name, neighborhood, or complaint"
                     class="ui-autocomplete-input" autocomplete="off"/>
            </div>
          </form>
        </div>
      </div>
    )
  }
});

module.exports = Nav;