var _ = require('lodash');
var $ = require('jquery');
var React = require('react');

var AppConstants = require('constants/AppConstants');
var Base = require('components/Base.react');
var SessionAPI = require('utils/SessionAPI');
var SessionActions = require('actions/SessionActions');
var SessionStore = require("stores/SessionStore");
var AppStore = require("stores/AppStore");
var StringUtil = require('utils/StringUtil');

var _timeout = false;


var SiteTitle = React.createClass(_.assign(Base(SessionStore), {
  componentDidMount: function() {
    SessionStore.addChangeListener(this._onChange);
  },

  componentDidUpdate: function () {
    document.title = this.state.siteTitle
  },

  componentWillUnmount: function () {
    SessionStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var disabled = !this.props.changable;
    return (
      <input className='site-title-input' type='text' value={this.state.siteTitle} disabled={disabled} onChange={this._onTitleChange} />
    )
  },

  _onTitleChange: function (e) {
    var newTitle = $(e.target).val();
    if (_timeout) {
      clearTimeout(_timeout);
    }

    this.setState({'siteTitle': newTitle})

    _timeout = setTimeout(function () {
      SessionAPI.updateSessionInfo({'title': newTitle});
      SessionActions.updateTitle(newTitle);
    }, 500);
  },

}));

module.exports = SiteTitle;
