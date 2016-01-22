var React = require('react');
var numeral = require('numeral');

var AppConstants = require('constants/AppConstants');
var OutcomeFilterActions = require('actions/ComplaintList/OutcomeFilterActions');


var OutcomeFilterItem = React.createClass({
  getDefaultProps: function () {
    return {
      type: 'all',
      name: 'All',
      quantity: 0
    }
  },

  setActiveFilter: function (event) {
    OutcomeFilterActions.setActiveFilter(this.props.type, this.props.callAPI)
  },

  render: function() {
    var type = this.props.type;
    var name = this.props.name;
    var quantity = this.props.quantity;
    var formattedQuantity = numeral(quantity).format(AppConstants.NUMERAL_FORMAT);

    var filterIconClass = ["fa fa-circle", type].join(' ');
    if (type != 'all') {
      var filterIcon = (<span><i className={filterIconClass}></i>{name} {formattedQuantity}</span>);
    } else {
      var filterIcon = (<span>{name} {formattedQuantity}</span>);
    }

    var activeClass = this.props.active ? 'active' : '';

    return (
      <span className={activeClass} key={type} onClick={this.setActiveFilter}>
        { filterIcon }
      </span>
    )
  }
});

module.exports = OutcomeFilterItem;
