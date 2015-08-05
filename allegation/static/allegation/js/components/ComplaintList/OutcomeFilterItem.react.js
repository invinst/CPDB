var React = require('react');
var OutcomeFilterItemActions = require('../../actions/ComplaintList/OutcomeFilterItemActions');

var OutcomeFilterItem = React.createClass({
  setOutcomeFilter: function(filter) {
    OutcomeFilterItemActions.setActiveFilter(filter);
  },

  render: function() {
    var type = this.props.type || 'all';
    var name = this.props.name || 'All';

    var filterIconClass = ["fa fa-circle", type].join(' ');
    var filterIcon = <span><i className={filterIconClass}></i>{name}</span>;
    var activeClass = this.props.active ? 'active' : '';

    return (
      <span className={activeClass} key={type} onClick={this.setOutcomeFilter.bind(this, type)}>
        { filterIcon }
      </span>
    )
  }
});

module.exports = OutcomeFilterItem;
