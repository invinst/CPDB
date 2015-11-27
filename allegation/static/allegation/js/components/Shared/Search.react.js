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
      appendTo: '#autocomplete-container',
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

  onSearchClick: function () {
    if (!this.props.mobileExpanded) {
      NavActions.mobileSearchClick();
    } else {
      NavActions.mobileSearchCollapse();
    }
  },

  render: function() {
    var searchIconClass = classnames(
      {
        'glyphicon glyphicon-search': !this.props.mobileExpanded,
        'glyphicon glyphicon-remove': this.props.mobileExpanded
      }
    );

    return (
      <div className="row search-row">
        <div className="col-md-12">
          <form role="search">
            <div className="input-group">
              <input type="text" id="autocomplete" placeholder="Search by a name/place/category, or click inside the graphs below"
                   className="ui-autocomplete-input form-control" autoComplete="off"/>
              <span className="input-group-btn">
                <button className="btn btn-primary" id="btn-search" type="button" onClick={this.onSearchClick}><i className={searchIconClass}></i></button>
              </span>
            </div>
          </form>
        </div>
      </div>
    )
  }
});

module.exports = Search;
