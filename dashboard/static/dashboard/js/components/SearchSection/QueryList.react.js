var _ = require('lodash');
var AddAliasModalActions = require('../../actions/SearchSection/AddAliasModalActions');
var Base = require('../Base.react');
var classnames = require('classnames');
var QueryListStore = require('../../stores/SearchSection/QueryListStore');
var QueryListActions = require('../../actions/SearchSection/QueryListActions');
var SearchResultsAPI = require('../../utils/SearchResultsAPI');
var React = require('react');
var moment = require('moment');

global.jQuery = require('jquery');
var QueryList = React.createClass(_.assign(Base(QueryListStore), {
  _onClick: function(alias, e) {
    e.preventDefault();
    AddAliasModalActions.show({
      alias: alias
    });
  },

  _onScroll: function(e) {
    var windowHeight = window.innerHeight;
    var toBottom = jQuery(document).height() - windowHeight - jQuery(window).scrollTop();

    if (toBottom <= 100 && !this.state.locked) {
      SearchResultsAPI.loadMore();
      QueryListActions.lockScroll();
    }
  },

  _onHeaderClick: function(sortBy) {
    QueryListActions.sortBy(sortBy);
    SearchResultsAPI.get();
  },

  componentDidMount: function () {
    QueryListStore.addChangeListener(this._onChange);
    jQuery(window).on('scroll', this._onScroll);
  },

  renderQueryList: function() {
    var that = this;
    return this.state.data.map(function(x) {
      return (
        <tr className='query'>
          <td>{x.search_query}</td>
          <td>{x.num_suggestions}</td>
          <td>{x.num_usage}</td>
          <td>{moment(x.updated_at).format('hh:mm a, DD MMM YYYY')}</td>
          <td>
            <a className="add-alias" onClick={that._onClick.bind(that, x.search_query)} href="#">
              <i className='fa fa-plus'/>
            </a>
          </td>
        </tr>
      )
    });
  },

  renderSortIcon: function(sortName) {
    var sortBy = this.state.sortBy;
    var isSorting = _(sortBy).contains(sortName);
    var isDesc = this.state.order < 0;

    var cx = classnames({
      'fa': true,
      'fa-sort': !isSorting,
      'sort-active': isSorting,
      'fa-sort-desc': isSorting && isDesc,
      'fa-sort-asc': isSorting && !isDesc
    });

    return (<i className={cx}></i>)
  },

  render: function() {
    return (
      <div className='table-responsive'>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th>Query</th>
              <th>No. of suggestions</th>
              <th onClick={this._onHeaderClick.bind(this, 'num_usage')}>No. of usage {this.renderSortIcon('num_usage')}</th>
              <th onClick={this._onHeaderClick.bind(this, 'updated_at')}>Last entered at {this.renderSortIcon('updated_at')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { this.renderQueryList() }
          </tbody>
        </table>
      </div>
    );
  }
}));

module.exports = QueryList;
