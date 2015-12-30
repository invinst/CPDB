var React = require('react');

var SuggestionPresenter = require('presenters/SuggestionPresenter');


var ComplaintSuggestionResult = React.createClass({
  _onClick: function () {
    var officer = this.props.officer;
    var presenter = SuggestionPresenter(officer);
    history.pushState(null, presenter.url);
  },

  render: function () {
    var complaint = this.props.complaint;
    var presenter = SuggestionPresenter(complaint);

    return (
      <div>
        <li className='table-view-cell'>
          <div className='link' onClick={this._onClick}>
            CRID <span className='highlight'>{presenter.resourceKey}</span>
          </div>
        </li>
      </div>
    );
  }
});

module.exports = ComplaintSuggestionResult;
