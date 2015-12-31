var React = require('react');
var cx = require('classnames');

var AppHistory = require('utils/History');

var OfficerCard = require('components/Shared/OfficerCard.react');
var SuggestionPresenter = require('presenters/SuggestionPresenter');
var OfficerUtil = require('utils/OfficerUtil');


var OfficerNameResult = React.createClass({
  _onClick: function () {
    var officer = this.props.suggestion;
    var presenter = SuggestionPresenter(officer);

    AppHistory.pushState(null, presenter.url);
  },

  render: function () {
    var officer = this.props.suggestion;
    var presenter = SuggestionPresenter(officer);

    return (
      <div>
        <li className='officer-name-results'>
          <div className='link officer officer-name-result-item' onClick={this._onClick}>
            <OfficerCard officerId={presenter.resourceKey} allegationsCount={presenter.allegationsCount}
                         displayName={presenter.text}
                         description={presenter.officerDescription}
            />
          </div>
        </li>
      </div>
    );
  }
});

module.exports = OfficerNameResult;
