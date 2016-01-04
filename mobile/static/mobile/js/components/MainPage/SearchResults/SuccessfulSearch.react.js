var cx = require('classnames');
var React = require('react');

var OfficerBadgeResult = require('components/MainPage/SearchResults/SuccessSearch/OfficerBadgeResult.react');
var OfficerNameResult = require('components/MainPage/SearchResults/SuccessSearch/OfficerNameResult.react');
var ComplaintResult = require('components/MainPage/SearchResults/SuccessSearch/ComplaintResult.react');

var SuggestionPresenter = require('presenters/SuggestionPresenter');
var DataTypeUtil = require('utils/DataTypeUtil');


var SuccessfulSearch = React.createClass({
  getSubComponentFor: function (type) {
    var subComponentMapper = {
      'officer_name': OfficerNameResult,
      'officer_badge': OfficerBadgeResult,
      'allegation_crid': ComplaintResult
    };

    return subComponentMapper[type];
  },

  renderSuggestionItem: function () {
    var suggestions = this.props.suggestions;
    var suggestionType = SuggestionPresenter(suggestions[0]).suggestionType;
    var term = this.props.term;
    var SubComponent = this.getSubComponentFor(suggestionType);

    return (
      <SubComponent term={term} suggestions={suggestions} />
    );
  },

  render: function () {
    return (
      <div className='success-search'>
        {this.renderSuggestionItem()}
      </div>
    )
  }
});

module.exports = SuccessfulSearch;
