var $ = require('jquery');
var classnames = require('classnames');
var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');

var FilterTagStore = require('stores/FilterTagStore');
var ShareButtonStore = require('stores/DataToolPage/ShareButtonStore');
var SiteTitleActions = require('actions/SiteTitleActions');
var SiteTitleStore = require('stores/SiteTitleStore');
var SessionStore = require('stores/SessionStore');


var SiteTitle = React.createClass({
  propTypes: {
    changable: React.PropTypes.bool
  },

  mixins: [PureRenderMixin],

  getDefaultProps: function () {
    return {
      changable: true
    };
  },

  getInitialState: function () {
    return {
      showDottedUnderline: false,
      siteTitle: SessionStore.getSiteTitle()
    };
  },

  componentDidMount: function () {
    document.title = this.state.siteTitle;
    SiteTitleStore.addChangeListener(this._onSiteTitleChange);
    ShareButtonStore.addChangeListener(this._onShareBarOrFilterTagChanged);
    FilterTagStore.addChangeListener(this._onShareBarOrFilterTagChanged);
  },

  componentDidUpdate: function () {
    document.title = this.state.siteTitle;
  },

  componentWillUnmount: function () {
    SiteTitleStore.removeChangeListener(this._onSiteTitleChange);
    ShareButtonStore.removeChangeListener(this._onShareBarOrFilterTagChanged);
    FilterTagStore.removeChangeListener(this._onShareBarOrFilterTagChanged);
  },

  _onSiteTitleChange: function () {
    this.setState({
      siteTitle: SiteTitleStore.getSiteTitle()
    });
  },

  _onSessionJustReceived: function () {
    this.setState({
      siteTitle: SessionStore.getSiteTitle()
    });
  },

  _onShareBarOrFilterTagChanged: function () {
    this.setState({
      showDottedUnderline: ShareButtonStore.isActive() && !FilterTagStore.isNoFilter()
    });
  },

  _onTitleChange: function (e) {
    var newTitle = $(e.target).val();
    SiteTitleActions.changeSiteTitle(newTitle);
  },

  render: function () {
    var disabled = !this.props.changable;
    var className = classnames('site-title-input', {
      'dashed-border': this.state.showDottedUnderline
    });

    return (
      <input className={ className } type='text' value={ this.state.siteTitle } disabled={ disabled }
        onChange={ this._onTitleChange } />
    );
  }
});

module.exports = SiteTitle;
