var React = require('react');


var ComplainingWitness = React.createClass({
  renderComplaintWitnessRow: function (complaningWitness) {
    return (
      <div className='complaining-witness-row row'>
        <div className='one column circle-wrapper center'>
            <div className='small-circle background-black circle'></div>
          </div>
        <div className='eleven columns'>
          {complaningWitness.gender}, {complaningWitness.race}, Age {complaningWitness.age}
        </div>
      </div>
    )
  },

  renderComplainingWitnessList: function () {
    return this.props.complainingWitness.map(this.renderComplaintWitnessRow);
  },

  render: function () {
    var numberOfComplainingWitness = this.props.complainingWitness.length;

    return (
      <div className='complaining-witness'>
        <div className='section-header'>
          <span className='pad'>
            <span className='section-title bold'>Complaining Witness&nbsp;</span>
            <span className='title-count normal-weight'>({numberOfComplainingWitness})</span>
          </span>
        </div>
        <div className='complaining-witness-list pad'>
          {this.renderComplainingWitnessList()}
        </div>
      </div>
    )
  }
});

module.exports = ComplainingWitness;
