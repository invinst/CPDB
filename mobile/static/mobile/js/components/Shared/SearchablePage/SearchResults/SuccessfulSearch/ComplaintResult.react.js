var React = require('react');

var CollectionUtil = require('utils/CollectionUtil');

var SuggestionPresenter = require('presenters/SuggestionPresenter');
var ComplaintResultPresenter = require('presenters/Page/ComplaintResultPresenter');
var OfficerAllegationItem = require('components/Shared/OfficerAllegationItem.react');


var ComplaintResult = React.createClass({
  propTypes: {
    suggestions: React.PropTypes.array
  },

  _onClick: function () {
    var complaint = this.props.suggestions[0];
    var presenter = SuggestionPresenter(complaint);
    ga('send', 'event', 'filter', presenter.resource, presenter.text);
  },

  renderAllegation: function (categoryId, officerAllegations, allegation) {
    var firstOfficerAllegation = CollectionUtil.first(officerAllegations);

    return (
      <div key={ categoryId }>
        <OfficerAllegationItem officerAllegation={ firstOfficerAllegation } officerAllegations={ officerAllegations }
          allegation={ allegation }/>
      </div>
    );
  },

  renderComplaintResultItem: function (officerAllegationGroups, allegation) {
    var currentOfficerAllegations, categoryId;
    var results = [];

    for (categoryId in officerAllegationGroups) {
      currentOfficerAllegations = officerAllegationGroups[categoryId];
      results.push(this.renderAllegation(categoryId, currentOfficerAllegations, allegation));
    }

    return results;
  },

  render: function () {
    var complaint = this.props.suggestions[0];
    var presenter = SuggestionPresenter(complaint);
    var complaintResultPresenter = ComplaintResultPresenter(presenter.meta);
    return (
      <ul className='suggestion-list'>
        <li className='complaint-results outer-glow' onClick={ this._onClick }>
          { this.renderComplaintResultItem(complaintResultPresenter.groupByCategory, presenter.meta) }
        </li>
      </ul>
    );
  }
});

module.exports = ComplaintResult;
