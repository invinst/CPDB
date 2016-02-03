var React = require('react');
var QueryItem = require('./QueryItem.react');
var QueryItemListStore = require('../../stores/OverviewSection/QueryListItemStore');
var _ = require('lodash');

var QueryItemList = React.createClass({
  getInitialState: function () {
    return QueryItemListStore.getState();
  },

  componentDidMount: function () {
    QueryItemListStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    QueryItemListStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    this.setState(QueryItemListStore.getState());
  },

  renderQueryItems: function () {
    var activeQueryItem = this.state.activeQueryItem;

    return _.map(this.state.queries, function (query, i) {
      return <QueryItem query={ query } key={ i } active={ query==activeQueryItem }/>;
    });
  },

  render: function () {
    return (
      <ul id='query-list-item' className='list-unstyled'>{ this.renderQueryItems() }</ul>
    );
  }
});

module.exports = QueryItemList;
