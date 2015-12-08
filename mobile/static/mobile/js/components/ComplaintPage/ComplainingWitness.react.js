var React = require('react');


var ComplainingWitness = React.createClass({
  renderComplaintWitnessRow: function (complaningWitness) {
    return (
        <li className='complaining-witness-row'>
          {complaningWitness.gender}, {complaningWitness.race}, Age {complaningWitness.age}
        </li>
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
          <span className='section-title bold'>Complaining Witness&nbsp;</span>
          <span className='title-count normal-weight'>({numberOfComplainingWitness})</span>
        </div>
        <ul className='complaining-witness-list'>
          {this.renderComplainingWitnessList()}
        </ul>
      </div>
    )
  }
});

module.exports = ComplainingWitness;
