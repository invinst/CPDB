var navigate = require('react-mini-router').navigate;
var React = require('react');

var FilterTagsActions = require('actions/FilterTagsActions');


var Search = React.createClass({
  componentDidMount: function () {
    cpdbAutocomplete($("#autocomplete"), this.select);
  },

  select: function (event, ui) {
    FilterTagsActions.addTag(ui.item.category, ui.item);
  },

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
