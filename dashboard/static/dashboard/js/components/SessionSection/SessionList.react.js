var _ = require('lodash');
var classnames = require('classnames');
global.jQuery = require('jquery');
var moment = require('moment');
var React = require('react');

var AddSessionAliasModalActions = require('actions/SessionSection/AddSessionAliasModalActions');
var Base = require('../Base.react');
var SessionsAPI = require('utils/SessionsAPI');
var SessionsActions = require('actions/SessionSection/SessionsActions');
var SessionListStore = require('stores/SessionSection/SessionListStore');
var SessionHistory = require('components/SessionSection/SessionHistory.react');

var SessionList = React.createClass(_.assign(Base(SessionListStore), {
  // TODO: Consider moving this to Mixins
  _onScroll: function(e) {
    var windowHeight = window.innerHeight;
    var toBottom = jQuery(document).height() - windowHeight - jQuery(window).scrollTop();

    if (toBottom <= 100 && !this.state.locked) {
      SessionsAPI.getMore();
      SessionsActions.lockScroll();
    }
  },

  _onClick: function (target, e) {
    e.preventDefault();
    AddSessionAliasModalActions.show({
      alias: '',
      target: target
    });
  },

  componentDidMount: function () {
    SessionListStore.addChangeListener(this._onChange);
    jQuery(window).on('scroll', this._onScroll);
  },

  renderSessionRow: function() {
    var that = this;
    var rows = [];

    this.state.data.forEach(function(x) {
      var id = 'session-row-' + x.hash_id;
      var dataTarget = '#' + id;
      rows.push(
        <tr className='session-row pointer' data-toggle='collapse' data-target={dataTarget} key={'c'+id}>
          <td>{x.hash_id}</td>
          <td>{x.title}</td>
          <td>{_(x.query.filters).values().pluck('value').flatten().size()}</td>
          <td>{x.ip}</td>
          <td>{x.user_agent}</td>
          <td>
            <a className="add-alias" onClick={that._onClick.bind(that, x.id)} href="#">&nbsp;
              <i className='fa fa-plus'/>
            </a>
          </td>
        </tr>
      );

      rows.push(
        <tr className='collapse' id={id} key={id}>
          <td colSpan='5'>
            <SessionHistory suggestions={x.suggestion_logs} filters={x.filter_logs}/>
          </td>
        </tr>
      );
    });

    return rows;
  },

  render: function() {
    return (
      <div className='table-responsive'>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th>Session</th>
              <th>Title</th>
              <th>Number of filters</th>
              <th>IP</th>
              <th>User agent</th>
            </tr>
          </thead>
          <tbody>
            { this.renderSessionRow() }
          </tbody>
        </table>
      </div>
    );
  }
}));

module.exports = SessionList;
