var React = require('react');

var AppHistory = require('utils/History');

var SuggestionPresenter = require('presenters/SuggestionPresenter');


var ComplaintResult = React.createClass({
  _onClick: function () {
    var officer = this.props.suggestion;
    var presenter = SuggestionPresenter(officer);
    AppHistory.pushState(null, presenter.url);
  },

  render: function () {
    var complaint = this.props.suggestion;
    var presenter = SuggestionPresenter(complaint);

    return (
      <div>
        <li className='complaint-results'>
          <div className='link complaint-result-item' onClick={this._onClick}>
            CRID <span className='highlight'>{presenter.resourceKey}</span> Incident {presenter.incidentDate}
          </div>
        </li>
      </div>
    );
  }
});

module.exports = ComplaintResult;
