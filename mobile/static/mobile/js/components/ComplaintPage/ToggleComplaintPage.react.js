var React = require('react');

var pluralize = require('pluralize');

var CollectionUtil = require('utils/CollectionUtil');

var ComplaintPageActions = require('actions/ComplaintPage/ComplaintPageActions');
var OfficerAllegationItem = require('components/Shared/OfficerAllegationItem.react');
var ToggleComplaintPagePresenter = require('presenters/Page/ToggleComplaintPagePresenter');
var AllegationPresenter = require('presenters/AllegationPresenter');


var ToggleComplaintPage = React.createClass({
  propTypes: {
    officerAllegations: React.PropTypes.array,
    allegation: React.PropTypes.object,
    numberOfAllegations: React.PropTypes.number
  },

  _onCloseBtnClick: function () {
    ComplaintPageActions.toggleClose();
  },

  renderAllegation: function (categoryId, officerAllegations) {
    var firstOfficerAllegation = CollectionUtil.first(officerAllegations);

    return (
      <div key={ categoryId }>
        <OfficerAllegationItem officerAllegation={ firstOfficerAllegation }
          officerAllegations={ officerAllegations } allegation={ this.props.allegation }/>
      </div>
    );
  },

  renderAllegationList: function (officerAllegationGroups) {
    var currentOfficerAllegations, categoryId;
    var results = [];

    for (categoryId in officerAllegationGroups) {
      currentOfficerAllegations = officerAllegationGroups[categoryId];
      results.push(this.renderAllegation(categoryId, currentOfficerAllegations));
    }

    return results;
  },

  render: function () {
    var officerAllegations = this.props.officerAllegations;
    var presenter = ToggleComplaintPagePresenter(officerAllegations);
    var allegationPresenter = AllegationPresenter(this.props.allegation);

    return (
      <div className='toggle-complaint-page'>
        <div className='headline-container'>
          <div className='row'>
            <div className='crid-container align-left'>
              <span className='crid-title'>CRID </span>
              <span className='crid-number'>{ allegationPresenter.crid }</span>
            </div>
            <div className='align-right'>
              <div className='toggle-container' onClick={ this._onCloseBtnClick }>
                <span className='number-of-allegations'>
                  { pluralize('complaint', this.props.numberOfAllegations, true) }
                </span>
                <div className='icon icon-close'></div>
              </div>
            </div>
          </div>
        </div>
        { this.renderAllegationList(presenter.groupByCategory) }
      </div>
    );
  }
});

module.exports = ToggleComplaintPage;
