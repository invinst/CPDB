var React = require('react');
var PropTypes = React.PropTypes;
var numeral = require('numeral');

var AppConstants = require('constants/AppConstants');
var OutcomeFilterActions = require('actions/ComplaintList/OutcomeFilterActions');


var OutcomeFilterItem = React.createClass({
  propTypes: {
    type: PropTypes.string,
    callAPI: PropTypes.bool,
    name: PropTypes.string,
    quantity: PropTypes.number,
    active: PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      type: 'all',
      name: 'All',
      quantity: 0
    };
  },

  setActiveFilter: function (event) {
    OutcomeFilterActions.setActiveFilter(this.props.type, this.props.callAPI);
  },

  render: function () {
    var type = this.props.type;
    var name = this.props.name;
    var quantity = this.props.quantity;
    var formattedQuantity = numeral(quantity).format(AppConstants.NUMERAL_FORMAT);

    var filterIconClass = ['fa fa-circle', type].join(' ');
    var filterIcon;
    var activeClass;

    if (type != 'all') {
      filterIcon = (<span><i className={ filterIconClass }></i>{ name } { formattedQuantity }</span>);
    } else {
      filterIcon = (<span>{ name } { formattedQuantity }</span>);
    }

    activeClass = this.props.active ? 'active' : '';

    return (
      <span className={ activeClass } key={ type } onClick={ this.setActiveFilter }>
        { filterIcon }
      </span>
    );
  }
});

module.exports = OutcomeFilterItem;
