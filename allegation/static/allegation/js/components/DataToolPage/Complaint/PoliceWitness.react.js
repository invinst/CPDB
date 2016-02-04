var pluralize = require('pluralize');
var React = require('react');
var PropTypes = React.PropTypes;

var genderPresenter = require('presenters/GenderPresenter');


var PoliceWitness = React.createClass({
  propTypes: {
    witnesses: PropTypes.array.isRequired
  },

  renderLegend: function () {
    return (
      <div className='row legend'>
        <div className='col-xs-4 col-md-12'>
          <span className='blue line'></span>Discipline Applied
        </div>
        <div className='col-xs-4 col-md-12'>
          <span className='red line'></span>No Punishment
        </div>
      </div>
    );
  },

  renderOfficers: function (witness) {
    return witness.officers.map(function (officer, i) {
      var style = {
        'width': (officer.no_action_taken / officer.num_complaints) * 100 + '%'
      };

      return (
        <div key={ i }>
          <div>
            { officer.officer.officer_first } { officer.officer.officer_last }
            &nbsp;
            ({ officer.num_complaints } { pluralize('case', officer.num_complaints) })
          </div>
          <div className='progress complaint'>
            <div className='progress-bar not-discipline' role='progressbar' style={ style }>
              <span className='sr-only'></span>
            </div>
          </div>
        </div>
      );
    });
  },

  renderWitnesses: function () {
    var renderOfficers = this.renderOfficers;
    var witnesses = this.props.witnesses;

    return witnesses.map(function (witness, i) {
      return (
        <div className='col-xs-6' key={ i }>
          <div className='results witness'>
            <div className='investigator-name'>
              { witness.witness_officer.officer_first } { witness.witness_officer.officer_last }
            </div>
            <div className='legend'>
              { genderPresenter(witness['witness_officer']['gender']) } { witness.witness_officer.race }
            </div>
            { renderOfficers(witness) }
          </div>
        </div>
      );
    });
  },

  render: function () {
    return (
      <div className='row margin-top'>
        <div>
          <div className='col-xs-12 section-title'>Police witnesses</div>
          <div className='col-xs-12 col-md-4 col-md-push-8'>
            { this.renderLegend() }
          </div>
          <div className='col-xs-12 col-md-8 col-md-pull-4'>
            <div className='row police-witness'>
              { this.renderWitnesses() }
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = PoliceWitness;
