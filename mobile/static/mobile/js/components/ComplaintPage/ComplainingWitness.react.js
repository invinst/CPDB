var React = require('react');


var ComplainingWitness = React.createClass({
  renderComplaintWitnessRow: function (complaningWitness) {
    return (
        <li className='complaining-witness-row'>
          {complaningWitness.gender}, {complaningWitness.race}, {complaningWitness.age}
        </li>
    )
  },

  renderComplainingWitnessList: function () {
    return this.props.complaining_witness.map(this.renderComplaintWitnessRow);
  },

  render: function () {
    var numberOfComplainingWitness = this.props.complaining_witness.length;

    return (
      <div className='complaining-witness'>
        <div className='section-header'>
          <div className='section-title bold'>
            Complaining Witness ({numberOfComplainingWitness})
          </div>
        </div>
        <ul className='complaining-witness-list'>
          {this.renderComplainingWitnessList()}
        </ul>
      </div>
    )
  }
});

module.exports = ComplainingWitness;
