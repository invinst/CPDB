var React = require('react');

var AppConstants = require('constants/AppConstants');
var FilterTagsActions = require('actions/FilterTagsActions');


var Search = React.createClass({
  componentDidMount: function () {
    this.initAutocomplete();
  },

  initAutocomplete: function () {
    $("#autocomplete").catcomplete({
      autoFocus: true,
      source: function (request, response) {
        $.ajax({
          url: "/search/suggest/",
          dataType: "json",
          data: {
            term: request.term
          },
          success: function (data) {
            var newData = [];
            $.each(data, function (i, subdata) {
              newData = newData.concat(subdata);
            });

            response(newData);
          }
        });
      },
      select: this.select,
      focus: function (event) {
        event.preventDefault();
      },
      categoryNames: AppConstants.AUTOCOMPLETE_CATEGORY_NAMES,
      categoriesDisplayInTag: AppConstants.AUTOCOMPLETE_DISPLAY_CATEGORY_IN_TAG
    });
  },

  select: function (event, ui) {
    event.preventDefault();
    FilterTagsActions.addTag(ui.item.category, ui.item);
    $("#autocomplete").val('');
  },

  render: function() {
    return (
      <form className="navbar-form" role="search">
        <div id="search-wrapper" className="pull-right">
          <input type="text" id="autocomplete" placeholder="Search by name, neighborhood, or complaint"
                 className="ui-autocomplete-input" autoComplete="off"/>
        </div>
      </form>
    )
  }
});

module.exports = Search;
