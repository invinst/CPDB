var Base = require('../Base.react');
var React = require('react');
var _ = require('lodash');
var QueryListFilterStore = require('../../stores/SearchSection/QueryListFilterStore');
var QueryListFilterActions = require('../../actions/SearchSection/QueryListFilterActions');
var AppConstants = require('../../constants/AppConstants');
var SearchResultsAPI = require('../../utils/SearchResultsAPI');
var cx = require('classnames');

var QueryListFilter = React.createClass(_.assign(Base(QueryListFilterStore), {
  renderQueryListFilters: function () {
    var that = this;

    return _.map(AppConstants.QUERY_LIST_FILTERS, function (name, key) {
      var classes = cx({
        'active': that.state.activeItem == key
      }, 'filter-' + key);

      return (
        <li key={ key } onClick={ that._onClick.bind(that, key) } className={ classes }>
          { name }
        </li>
      );
    });
  },

  render: function () {
    return (
      <div className='col-md-6 col-xs-6'>
        <ul className='filter'>
          { this.renderQueryListFilters() }
        </ul>
      </div>
    );
  },

  _onClick: function (key) {
    QueryListFilterActions.setActiveItem(key);
    SearchResultsAPI.get();
  }
}));

module.exports = QueryListFilter;
