var React = require('react');
var OutcomeFilterActions = require('../../actions/ComplaintList/OutcomeFilterActions');

var OutcomeFilterItem = React.createClass({
  setOutcomeFilter: function(filter) {
    OutcomeFilterActions.setActiveFilter(filter);
  },

  render: function() {
    var type = this.props.type || 'all';
    var name = this.props.name || 'All';
    var quantity = this.props.quantity || 0;
    var filterIconClass = ["fa fa-circle", type].join(' ');
    var filterIcon = <span><i className={filterIconClass}></i>{name} ({quantity})</span>;
    var activeClass = this.props.active ? 'active' : '';

    return (
      <span className={activeClass} key={type} onClick={this.setOutcomeFilter.bind(this, type)}>
        { filterIcon }
      </span>
    )
  }
});

module.exports = OutcomeFilterItem;
