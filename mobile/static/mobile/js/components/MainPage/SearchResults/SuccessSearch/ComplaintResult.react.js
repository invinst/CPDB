var React = require('react');

var AppHistory = require('utils/History');

var SuggestionPresenter = require('presenters/SuggestionPresenter');


var ComplaintResult = React.createClass({
  _onClick: function () {
    var officer = this.props.officer;
    var presenter = SuggestionPresenter(officer);
    AppHistory.pushState(null, presenter.url);
  },

  render: function () {
    var complaint = this.props.complaint;
    var presenter = SuggestionPresenter(complaint);

    return (
      <div>
        <li className='suggestion-item'>
          <div className='link' onClick={this._onClick}>
            CRID <span className='highlight'>{presenter.resourceKey}</span>
          </div>
        </li>
      </div>
    );
  }
});

module.exports = ComplaintResult;
