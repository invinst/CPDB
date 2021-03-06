var _ = require('lodash');
var React = require('react');
var PropTypes = React.PropTypes;

var Officer = require('components/DataToolPage/Officer.react');
var RelatedOfficersStore = require('stores/OfficerPage/RelatedOfficersStore');


var RelatedOfficers = React.createClass({
  propTypes: {
    relatedOfficers: PropTypes.array
  },

  getInitialState: function () {
    return RelatedOfficersStore.getState();
  },

  componentDidMount: function () {
    RelatedOfficersStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    RelatedOfficersStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    this.setState(RelatedOfficersStore.getState());
  },

  renderRelatedOfficerList: function () {
    var activeOfficers = this.state['active_officers'];

    return this.props.relatedOfficers.map(function (officer) {
      var selected = _(activeOfficers).contains(officer.officer.id);

      return (
        <div className='col-lg-2 col-md-3 col-sm-4 col-sm-offset-0 col-xs-6' key={ officer.officer.id }>
          <Officer officer={ officer.officer }
            intersection={ officer.num_allegations }
            witness={ officer.witness }
            active={ true }
            page='officer-details' selected={ selected }/>
        </div>
      );
    });
  },

  renderTitle: function () {
    var title = this.props.relatedOfficers.length ? 'Co-accused Officers' : '';
    return (
      <div className='row'>
        <h3 className='col-md-12'>{ title }</h3>
      </div>
    );
  },

  render: function () {
    return (
      <div className='related-officers'>
        { this.renderTitle() }
        <div className='row'>
          { this.renderRelatedOfficerList() }
        </div>
      </div>
    );
  }
});

module.exports = RelatedOfficers;
