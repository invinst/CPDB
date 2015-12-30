var React = require('react');

var OfficerBadgeResult = require('components/MainPage/SearchResults/SuccessSearch/OfficerBadgeResult.react');
var OfficerNameResult = require('components/MainPage/SearchResults/SuccessSearch/OfficerNameResult.react');
var ComplaintResult = require('components/MainPage/SearchResults/SuccessSearch/ComplaintResult.react');

var SuggestionPresenter = require('presenters/SuggestionPresenter');
var DataTypeUtil = require('utils/DataTypeUtil');


var SuccessfulSearch = React.createClass({
  renderSuggestionItem: function (suggestion) {
    var presenter = SuggestionPresenter(suggestion);
    var term = this.props.term;

    if (presenter.resource == 'officer') {
      if (DataTypeUtil.isNumeric(term)) {
        return (
          <OfficerBadgeResult term={term} officer={suggestion}/>
        );
      }

      return (
        <OfficerNameResult officer={suggestion}/>
      );
    }

    return (
      <ComplaintResult complaint={suggestion}/>
    );
  },

  render: function () {
    var suggestions = this.props.suggestions;

    return (
      <div>
        <ul className='suggestion-list'>
          {suggestions.map(this.renderSuggestionItem)}
        </ul>
      </div>
    )
  }
});

module.exports = SuccessfulSearch;
