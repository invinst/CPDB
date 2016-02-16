var _ = require('lodash');
var $ = require('jquery');
var classnames = require('classnames');
var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');

var Base = require('components/Base.react');
var SessionAPI = require('utils/SessionAPI');
var SessionActions = require('actions/SessionActions');
var SessionStore = require('stores/SessionStore');
var FilterTagStore = require('stores/FilterTagStore');
var ShareBarStore = require('stores/DataToolPage/ShareBarStore');

var _timeout = false;


var SiteTitle = React.createClass(_.assign(Base(SessionStore), {
  mixins: [PureRenderMixin],

  componentDidMount: function () {
    SessionStore.addChangeListener(this._onChange);
    ShareBarStore.addChangeListener(this._onToggleShareBar);
    FilterTagStore.addChangeListener(this._onToggleShareBar);
  },

  componentDidUpdate: function () {
    document.title = this.state.siteTitle;
  },

  componentWillUnmount: function () {
    SessionStore.removeChangeListener(this._onChange);
    ShareBarStore.removeChangeListener(this._onToggleShareBar);
    FilterTagStore.removeChangeListener(this._onToggleShareBar);
  },

  render: function () {
    var disabled = !this.props.changable;
    var className = classnames('site-title-input', {
      'dashed-border': this.state.isHasFilterOnShareMode
    });

    return (
      <input className={ className } type='text' value={ this.state.siteTitle } disabled={ disabled }
        onChange={ this._onTitleChange } />
    );
  },

  _onChange: function () {
    this.setState({
      siteTitle: SessionStore.getSiteTitle()
    });
  },

  _onToggleShareBar: function () {
    this.setState({
      isHasFilterOnShareMode: ShareBarStore.isActive() && !FilterTagStore.isNoFilter()
    });
  },

  _onTitleChange: function (e) {
    var newTitle = $(e.target).val();
    if (_timeout) {
      clearTimeout(_timeout);
    }

    this.setState({'siteTitle': newTitle});

    _timeout = setTimeout(function () {
      SessionAPI.updateSessionInfo({'title': newTitle});
      SessionActions.updateTitle(newTitle);
    }, 500);
  }

}));

module.exports = SiteTitle;
