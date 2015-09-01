var React = require('react');
var Officer = require('../Officer.react');
var _ = require('lodash');


var RelatedOfficers = React.createClass({

  getInitialState: function () {
    return { 'relatedOfficers': {} };
  },

  renderRelatedOfficerList: function() {
    return _.map(this.props.relatedOfficers, function(officer) {
      return (
        <div className='col-md-2' key={officer.officer.id}>
          <Officer officer={officer.officer}
                   noClick={true}
                   intersection={officer.num_allegations}
                   witness={officer.witness}
                   active={true} />
        </div>
      );
    });
  },

  renderTitle: function() {
    var title = this.props.relatedOfficers.length ? 'Related Officers' : '';
    return (
      <div className='row'>
        <h3 className='col-md-12'>{title}</h3>
      </div>
    );
  },

  render: function () {
    return (
      <div>
        {this.renderTitle() }
        <div className='row'>
          {this.renderRelatedOfficerList()}
        </div>
      </div>
    );
  }
});

module.exports = RelatedOfficers;
