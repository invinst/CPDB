var React = require('react');

var ComplainingWitnessPresenter = require('presenters/ComplainingWitnessPresenter');
var Wrapper = require('components/Shared/Wrapper.react');


var ComplainingWitness = React.createClass({
  propTypes: {
    complainingWitnesses: React.PropTypes.array
  },

  renderComplaintWitnessRow: function (complainingWitness) {
    var complainingWitnessPresenter = ComplainingWitnessPresenter(complainingWitness);

    // TODO: Adding id to complainingWitness
    return (
      <div className='complaining-witness-row row' key={ complainingWitness['cwit_id'] }>
        <div className='one column circle-wrapper center'>
          <div className='small-circle background-black circle'></div>
        </div>
        <div className='eleven columns'>
          { complainingWitnessPresenter.description }
        </div>
      </div>
    );
  },

  renderComplainingWitnessList: function (complainingWitnesses) {
    return complainingWitnesses.map(this.renderComplaintWitnessRow);
  },

  render: function () {
    var complainingWitnesses = this.props.complainingWitnesses || [];
    var numberOfComplainingWitness = complainingWitnesses.length;

    return (
      <Wrapper visible={ numberOfComplainingWitness > 0 } wrapperClass='complaining-witness'>
        <div className='section-header'>
          <span className='pad'>
            <span className='section-title bold'>Complaining Witness&nbsp;</span>
            <span className='title-count normal-weight'>({ numberOfComplainingWitness })</span>
          </span>
        </div>
        <div className='complaining-witness-list pad'>
          { this.renderComplainingWitnessList(complainingWitnesses) }
        </div>
      </Wrapper>
    );
  }
});

module.exports = ComplainingWitness;
