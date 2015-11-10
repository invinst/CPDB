var classnames = require('classnames');
var navigate = require('react-mini-router').navigate;
var React = require('react');

var AppConstants = require('constants/AppConstants');
var FilterTagsActions = require('actions/FilterTagsActions');
var NavActions = require('actions/NavActions');


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

  componentDidUpdate: function () {
    $('#autocomplete').focus();
  },

  select: function (event, ui) {
    event.preventDefault();
    FilterTagsActions.addTag(ui.item.category, ui.item);
    $("#autocomplete").val('');
  },

  onSearchClick: function () {
    if (!this.props.mobileExpanded) {
      NavActions.mobileSearchClick();
    } else {
      NavActions.mobileSearchCollapse();
    }
  },

  render: function() {
    var inputClass = classnames(
      "ui-autocomplete-input",
      {
        'hidden-xs': !this.props.mobileExpanded
      }
    );
    var searchIconClass = classnames(
      {
        'glyphicon glyphicon-search': !this.props.mobileExpanded,
        'glyphicon glyphicon-remove': this.props.mobileExpanded
      }
    );

    return (
      <form className="navbar-form" role="search">
        <div id="search-wrapper" className="pull-right">
          <input type="text" id="autocomplete" placeholder="Search by name, neighborhood, or allegation"
                 className={inputClass} autoComplete="off"/>
          <a className='search-icon-link' href='javascript:void(0);' onClick={this.onSearchClick}>
            <i className={searchIconClass}></i>
          </a>
        </div>
      </form>
    )
  }
});

module.exports = Search;
