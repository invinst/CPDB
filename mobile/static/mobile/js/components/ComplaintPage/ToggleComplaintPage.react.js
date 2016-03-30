var React = require('react');

var ComplaintPageActions = require('actions/ComplaintPage/ComplaintPageActions');
var OfficerAllegationItem = require('components/ComplaintPage/ToggleComplaintPage/OfficerAllegationItem.react');
var ToggleComplaintPagePresenter = require('presenters/Page/ToggleComplaintPagePresenter');


var ToggleComplaintPage = React.createClass({
  propTypes: {
    officerAllegations: React.PropTypes.array,
    allegation: React.PropTypes.object
  },

  _onCloseBtnClick: function () {
    ComplaintPageActions.toggleClose();
  },

  renderAllegation: function (categoryId, officerAllegations) {
    return (
      <div key={ categoryId }>
        <OfficerAllegationItem officerAllegations={ officerAllegations } allegation={ this.props.allegation }/>
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


    return (
      <div className='toggle-complaint-page'>
        <div className='icon icon-close' onClick={ this._onCloseBtnClick }></div>
        { this.renderAllegationList(presenter.groupByCategory) }
      </div>
    );
  }
});

module.exports = ToggleComplaintPage;
