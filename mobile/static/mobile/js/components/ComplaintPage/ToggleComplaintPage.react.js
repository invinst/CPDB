var React = require('react');

var ComplaintPageActions = require('actions/ComplaintPage/ComplaintPageActions');
var OfficerAllegationItem = require('components/ComplaintPage/ToggleComplaintPage/OfficerAllegationItem.react');


var ToggleComplaintPage = React.createClass({
  propTypes: {
    officerAllegations: React.PropTypes.array,
    allegation: React.PropTypes.object
  },

  _onCloseBtnClick: function () {
    ComplaintPageActions.toggleClose();
  },

  renderOfficerAllegationItem: function (officerAllegation) {
    return (
      <div>
        <OfficerAllegationItem officerAllegation={ officerAllegation } allegation={ this.props.allegation }/>
      </div>
    );
  },

  render: function () {
    var officerAllegations = this.props.officerAllegations;

    return (
      <div className='toggle-complaint-page'>
        <div className='icon icon-close' onClick={ this._onCloseBtnClick }></div>
        { officerAllegations.map(this.renderOfficerAllegationItem) }
      </div>
    );
  }
});

module.exports = ToggleComplaintPage;
