var React = require('react');
var PropTypes = React.PropTypes;

var AppHistory = require('utils/History');
var SuggestionPresenter = require('presenters/SuggestionPresenter');


var ComplaintResult = React.createClass({
  propTypes: {
    suggestions: PropTypes.array
  },

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
          <div className='link pad complaint-result-item' onClick={ this._onClick }>
            CRID <span className='highlight'>{ presenter.resourceKey }</span> Incident { presenter.incidentDate }
          </div>
        </li>
      </ul>
    );
  }
});

module.exports = ComplaintResult;
