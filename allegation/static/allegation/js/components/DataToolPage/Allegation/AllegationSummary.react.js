var _ = require('lodash');
var classnames = require('classnames');
var React = require('react');
var PropTypes = React.PropTypes;

var AllegationPresenter = require('presenters/AllegationPresenter');
var Investigator = require('components/DataToolPage/Complaint/Investigator.react');
var RequestButton = require('components/DataToolPage/Complaint/RequestButton.react');
var ComplaintListActions = require('actions/ComplaintList/ComplaintListActions');
var SessionAPI = require('utils/SessionAPI');

var AllegationSummary = React.createClass({
  propTypes: {
    allegation: PropTypes.object.isRequired
  },

  renderComplainingWitnessSection: function (allegation) {
    if (_.isEmpty(allegation.complainingWitness)) {
      return '';
    }

    return (
      <div>
        <div className='title'>Complaining Witness</div>
        <div>
          <ul>
            { this.renderComplainingWitness(allegation) }
          </ul>
        </div>
      </div>
    );
  },

  renderComplainingWitness: function (allegation) {
    return allegation.complainingWitness.map(function (item, i) {
      return (
        <li key={ i }>
          { item }
        </li>
      );
    });
  },

  renderInvestigator: function (allegation) {
    if (allegation.investigator) {
      return (
        <div className='col-xs-12'>
          <div className='title'>Investigator</div>
          <Investigator complaint={ allegation }/>
        </div>
      );
    }
    return '';
  },

  renderDocumentRequestButton: function (allegation) {
    var cssClasses = classnames('row-fluid complaint_detail clearfix slide-down', {
      'closed': this.props.hide
    });

    if (!this.props.noButton) {
      return (
        <div className='allegation-function'>
          <RequestButton complaint={ allegation } />
          <button type='button' className='btn btn-close' onClick={ this.props.toggleComplaint }>
            <i className='fa fa-times' /> Close
          </button>
        </div>
      );
    }
    return '';
  },

  render: function () {
    var allegation = this.props.allegation;
    var presenter = AllegationPresenter(allegation);

    return (
      <div className='col-xs-12'>
        <div className='allegation-info'>
          <div>
            <span className='title'>CRID</span> { presenter.crid }
          </div>
          <div>
            <div className='main-category'>{ presenter.mainCategory }</div>
            <div className='title'>{ presenter.subCategory }</div>
          </div>
          <div>
            <div className='title'>Final Outcome</div>
            <div>{ presenter.finalOutcome }</div>
          </div>
          <div>
            <div className='title'>Disciplinary action</div>
            <div>{ presenter.finalFinding }</div>
          </div>
          { this.renderComplainingWitnessSection(presenter) }
          <div className='row'>
            { this.renderInvestigator(allegation) }
          </div>
        </div>
        { this.renderDocumentRequestButton(allegation) }
      </div>
    );
  }
});

module.exports = AllegationSummary;
