var _ = require('lodash');
var React = require('react');
var PropTypes = React.PropTypes;

var AllegationPresenterFactory = require('presenters/AllegationPresenterFactory');
var Investigator = require('components/DataToolPage/Complaint/Investigator.react');
var RequestButton = require('components/DataToolPage/Complaint/RequestButton.react');
var Documents = require('components/DataToolPage/Complaint/Documents.react');


var AllegationSummary = React.createClass({
  propTypes: {
    allegation: PropTypes.object.isRequired,
    noButton: PropTypes.bool,
    toggleComplaint: PropTypes.func
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

  renderAllegationFunction: function () {
    if (!this.props.noButton) {
      return (
        <div className='allegation-function'>
          <button type='button' className='btn btn-close' onClick={ this.props.toggleComplaint }>
            <i className='fa fa-times' /> Close
          </button>
        </div>
      );
    }
    return '';
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

  render: function () {
    var allegation = this.props.allegation;
    var presenter = AllegationPresenterFactory.buildPresenter(allegation);

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

          { presenter.displayRecFinding ?
            <div className='rec-finding'>
              <div className='title'>Recommended Finding</div>
              <div>{ presenter.recFinding }</div>
            </div>
            : null
          }
          <div>
            <div className='title'>Final Finding</div>
            <div>{ presenter.finalFinding }</div>
          </div>

          { presenter.displayRecOutcome ?
            <div className='rec-outcome'>
              <div className='title'>Recommended Outcome</div>
              <div>{ presenter.recOutcome }</div>
            </div>
            : null
          }
          <div>
            <div className='title'>Final Outcome</div>
            <div>{ presenter.finalOutcome }</div>
          </div>

          { this.renderComplainingWitnessSection(presenter) }
          <div className='row'>
            { this.renderInvestigator(allegation) }
          </div>
        </div>
        <div className='documents-list'>
          <Documents documents={ presenter.orderedDocuments } />
        </div>
        { this.renderAllegationFunction(allegation) }
      </div>
    );
  }
});

module.exports = AllegationSummary;
