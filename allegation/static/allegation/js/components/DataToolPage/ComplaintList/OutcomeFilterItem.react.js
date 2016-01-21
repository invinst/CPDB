var React = require('react');
var numeral = require('numeral');
var AppConstants = require('constants/AppConstants');

var OutcomeFilterItem = React.createClass({
  render: function() {
    var type = this.props.type || 'all';
    var name = this.props.name || 'All';
    var quantity = this.props.quantity || 0;
    var formattedQuantity = numeral(quantity).format(AppConstants.NUMERAL_FORMAT);

    var filterIconClass = ["fa fa-circle", type].join(' ');
    if (type != 'all') {
      var filterIcon = (<span><i className={filterIconClass}></i>{name} {formattedQuantity}</span>);
    } else {
      var filterIcon = (<span>{name} {formattedQuantity}</span>);
    }

    var activeClass = this.props.active ? 'active' : '';

    return (
      <span className={activeClass} key={type} onClick={this.props.clickFunction}>
        { filterIcon }
      </span>
    )
  }
});

module.exports = OutcomeFilterItem;
