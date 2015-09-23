var React = require('react');
var QueryItemListActions = require('../../actions/OverviewSection/QueryItemListActions');


var QueryItem = React.createClass({
  render: function() {
    var activeClass = this.props.active ? 'active' : '';
    var query = this.props.query || '';

    return (
      <li className={activeClass} onClick={this._onClick}>
        {query}
      </li>
    )
  },

  _onClick: function() {
    QueryItemListActions.setActiveItem(this.props.query);
  }
});

module.exports = QueryItem;
