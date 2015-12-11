var React = require('react');

var HelperUtil = require('utils/HelperUtil');
var ComplainingWitnessPresenter = require('presenters/ComplainingWitnessPresenter');


var ComplainingWitness = React.createClass({
  renderComplaintWitnessRow: function (complainingWitness) {
    var complainingWitnessPresenter = ComplainingWitnessPresenter(complainingWitness);

    // TODO: Adding id to complainingWitness
    return (
      <div className='complaining-witness-row row' key={complainingWitness.id}>
        <div className='one column circle-wrapper center'>
            <div className='small-circle background-black circle'></div>
          </div>
        <div className='eleven columns'>
          {complainingWitnessPresenter.description}
        </div>
      </div>
    )
  },

  renderComplainingWitnessList: function (complainingWitnesses) {
    return complainingWitnesses.map(this.renderComplaintWitnessRow);
  },

  render: function () {
    var complainingWitnesses = this.props.complainingWitness || [];
    var numberOfComplainingWitness = complainingWitnesses.length;

    if (numberOfComplainingWitness == 0) {
      return (
        <div></div>
      )
    }

    return (
      <div className='complaining-witness'>
        <div className='section-header'>
          <span className='pad'>
            <span className='section-title bold'>Complaining Witness&nbsp;</span>
            <span className='title-count normal-weight'>({numberOfComplainingWitness})</span>
          </span>
        </div>
        <div className='complaining-witness-list pad'>
          {this.renderComplainingWitnessList(complainingWitnesses)}
        </div>
      </div>
    )
  }
});

module.exports = ComplainingWitness;
