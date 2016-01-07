var React = require('react');

var AppHistory = require('utils/History');
var AppConstants = require('constants/AppConstants');
var SuggestionPresenter = require('presenters/SuggestionPresenter');


var ComplaintResult = React.createClass({
  _onClick: function () {
    var officer = this.props.suggestions[0];
    var presenter = SuggestionPresenter(officer);
    AppHistory.pushState(null, presenter.url);
  },

  render: function () {
    var complaint = this.props.suggestions[0];
    var presenter = SuggestionPresenter(complaint);

    return (
      <ul className='suggestion-list'>
        <li className='complaint-results outer-glow'>
          <div className='link pad complaint-result-item' onClick={this._onClick}>
            <div className='complaint-header pad'>
              <span className='complaint-label'> Complaint<span className='dot-bullet'>&#8226;</span></span>
              <span className='crid-title'>&nbsp; CRID&nbsp;</span>
              <span className='crid-value highlight'>{presenter.resourceKey}</span>
              <span className='incident-date'>{presenter.meta.getIncidentDate(AppConstants.SEARCH_INCIDENT_DATE_FORMAT)}</span>
            </div>
            <div className='complaint-category pad'>
              <div className='sub-category bold'>
                {presenter.meta.category}
              </div>
              <div className='category'>
                {presenter.meta.allegationName}
              </div>
            </div>
          </div>
        </li>
      </ul>
    );
  }
});

module.exports = ComplaintResult;
