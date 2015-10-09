var _ = require('lodash');
var classnames = require('classnames');
global.jQuery = require('jquery');
var moment = require('moment');
var React = require('react');

var Base = require('../Base.react');
var SessionsAPI = require('utils/SessionsAPI');
var SessionsActions = require('actions/SessionSection/SessionsActions');
var SessionListStore = require('stores/SessionSection/SessionListStore');

var SessionList = React.createClass(_.assign(Base(SessionListStore), {
  _onScroll: function(e) {
    var windowHeight = window.innerHeight;
    var toBottom = jQuery(document).height() - windowHeight - jQuery(window).scrollTop();

    if (toBottom <= 100 && !this.state.locked) {
      SessionsAPI.getMore();
      SessionsActions.lockScroll();
    }
  },

  componentDidMount: function () {
    SessionListStore.addChangeListener(this._onChange);
    jQuery(window).on('scroll', this._onScroll);
  },

  renderSessionRow: function() {
    var that = this;
    return this.state.data.map(function(x) {
      return (
        <tr className='session-row'>
          <td>{x.hash_id}</td>
          <td>{x.title}</td>
          <td>{_(x.query.filters).values().pluck('value').flatten().size()}</td>
          <td>{x.ip}</td>
          <td>{x.user_agent}</td>
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
