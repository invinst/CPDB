var navigate = require('react-mini-router').navigate;
var React = require('react');

var Search = React.createClass({
  render: function() {
    return (
      <form className="navbar-form navbar-right" role="search">
        <div id="search-wrapper">
          <input type="text" id="autocomplete" placeholder="Search by name, neighborhood, or complaint"
                 className="ui-autocomplete-input" autoComplete="off"/>
        </div>
      </form>
    )
  }
});

module.exports = Search;
