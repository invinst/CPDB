var Base = require('../Base.react');
var React = require('react');
var _ = require('lodash');
var QueryListFilterStore = require('../../stores/SearchSection/QueryListStore');


var QueryListFilter = React.createClass(_.assign(Base(QueryListFilterStore), {
  render: function() {
    return (
      <div></div>
    )
  }
}));

module.exports = QueryListFilter;
