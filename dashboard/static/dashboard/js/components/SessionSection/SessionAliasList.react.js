var _ = require('lodash');
var classnames = require('classnames');
var moment = require('moment');
var jQuery = require('jquery');
var React = require('react');
var bootbox = require('bootbox');


var AddSessionAliasModalActions = require('actions/SessionSection/AddSessionAliasModalActions');
var Base = require('../Base.react');
var SessionAliasAPI = require('utils/SessionAliasAPI');
var SessionsAliasActions = require('actions/SessionSection/SessionsAliasActions');
var SessionAliasListStore = require('stores/SessionSection/SessionAliasListStore');


var SessionList = React.createClass(_.assign(Base(SessionAliasListStore), {
  // TODO: Consider moving this to Mixins
  _onScroll: function(e) {
    var windowHeight = window.innerHeight;
    var toBottom = jQuery(document).height() - windowHeight - jQuery(window).scrollTop();

    if (toBottom <= 100 && !this.state.locked) {
      SessionAliasAPI.getMore();
      SessionsAliasActions.lockScroll();
    }
  },

  componentDidMount: function () {
    SessionAliasListStore.addChangeListener(this._onChange);
    jQuery(window).on('scroll', this._onScroll);
  },

  deleteAlias: function (alias, e) {
    e.preventDefault();

    bootbox.confirm("Confirm delete alias \"" + alias.alias +"\"", function (yes) {
      if (yes) {
        SessionAliasAPI.deleteAlias(alias);
      }
    });
  },

  renderSessionRow: function() {
    var that = this;
    var rows = [];

    this.state.data.forEach(function(x) {
      var id = 'session-row-' + x.id;
      rows.push(
        <tr className='alias-row pointer' key={'c'+id}>
          <td className="alias">{x.alias}</td>
          <td>{x.session.hash_id}</td>
          <td>{x.session.title}</td>
          <td>{x.user}</td>
          <td><a className="delete" href="javascript: void()" onClick={that.deleteAlias.bind(that, x)}>Delete</a></td>
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
              <th>Alias</th>
              <th>Session</th>
              <th>Title</th>
              <th>User</th>
              <th></th>
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
