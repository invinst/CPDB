var React = require('react');


var SiteLinks = React.createClass({
  render: function() {
    return (
      <div>
        <ul className='nav nav-tabs site-links pull-right'>
          <li>
            <a href='/landing'>Findings</a>
          </li>
          <li>
            <a href='/landing/#story-page'>Stories</a>
          </li>
          <li>
            <a href='/landing/#methodology-page'>Methods</a>
          </li>
          <li>
            <a href='#!/data-tools'>Data</a>
          </li>
        </ul>
      </div>
    )
  }
});

module.exports = SiteLinks;