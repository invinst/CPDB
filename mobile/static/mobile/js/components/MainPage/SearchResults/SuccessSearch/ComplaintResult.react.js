var React = require('react');

var AppHistory = require('utils/History');

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
        <li className='complaint-results'>
          <div className='link pad complaint-result-item' onClick={this._onClick}>
            <div className='complaint-header pad'>
              <span className='complaint-label'> Complaint &#8226;</span>
              <span className='crid-title'>&nbsp; CRID&nbsp;</span>
              <span className='crid-value'>{presenter.resourceKey}</span>
              <span className='incident-date'>{presenter.meta.incidentDate}</span>
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
