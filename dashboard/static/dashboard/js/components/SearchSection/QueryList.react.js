var _ = require('lodash');
var AddAliasModalActions = require('../../actions/SearchSection/AddAliasModalActions');
var Base = require('../Base.react');
var QueryListStore = require('../../stores/SearchSection/QueryListStore');
var QueryListActions = require('../../actions/SearchSection/QueryListActions');
var SearchResultsAPI = require('../../utils/SearchResultsAPI');
var React = require('react');

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

  componentDidMount: function () {
    QueryListStore.addChangeListener(this._onChange);
    jQuery(window).on('scroll', this._onScroll);
  },

  renderQueryList: function() {
    var that = this;
    return this.state.data.map(function(x) {
      return (
        <tr className='query'>
          <td>{x.query}</td>
          <td>{x.num_suggestions}</td>
          <td>{x.num_usage}</td>
          <td>
            <a className="add-alias" onClick={that._onClick.bind(that, x.query)} href="#">
              <i className='fa fa-plus'/>
            </a>
          </td>
        </tr>
      )
    });
  },

  render: function() {
    return (
      <div className='table-responsive'>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th>Query</th>
              <th>No. of suggestions</th>
              <th>No. of usage</th>
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
