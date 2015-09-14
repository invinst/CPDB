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
        <div className='col-lg-2 col-md-3 col-sm-4 col-sm-offset-0 col-xs-6' key={officer.id}>
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
