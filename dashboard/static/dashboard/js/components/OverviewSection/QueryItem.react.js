var React = require('react');
var PropTypes = React.PropTypes;

var QueryItemListActions = require('../../actions/OverviewSection/QueryItemListActions');


var QueryItem = React.createClass({
  propTypes: {
    query: PropTypes.string,
    active: PropTypes.bool
  },

  _onClick: function () {
    QueryItemListActions.setActiveItem(this.props.query);
  },

  render: function () {
    var activeClass = this.props.active ? 'active' : '';
    var query = this.props.query || '';

    return (
      <li className={ activeClass } onClick={ this._onClick }>
        { query }
      </li>
    );
  }
});

module.exports = QueryItem;
