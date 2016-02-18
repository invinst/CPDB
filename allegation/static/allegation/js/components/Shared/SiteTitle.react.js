var _ = require('lodash');
var $ = require('jquery');
var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');

var Base = require('components/Base.react');
var DOMUtils = require('utils/DOMUtils');
var SessionAPI = require('utils/SessionAPI');
var SessionStore = require('stores/SessionStore');
var FilterTagStore = require('stores/FilterTagStore');
var ShareBarStore = require('stores/DataToolPage/ShareBarStore');

var _timeout = false;


var SiteTitle = React.createClass(_.assign(Base(SessionStore), {
  mixins: [PureRenderMixin],

  componentDidMount: function () {
    document.title = this.state.siteTitle;
    SessionStore.addChangeListener(this._onChange);
    ShareBarStore.addChangeListener(this._onShareBarOrFilterTagChanged);
    FilterTagStore.addChangeListener(this._onShareBarOrFilterTagChanged);
  },

  componentDidUpdate: function () {
    document.title = this.state.siteTitle;
  },

  componentWillUnmount: function () {
    SessionStore.removeChangeListener(this._onChange);
    ShareBarStore.removeChangeListener(this._onShareBarOrFilterTagChanged);
    FilterTagStore.removeChangeListener(this._onShareBarOrFilterTagChanged);
  },

  renderDottedUnderline: function () {
    var underLineWidth, style, inputStyle;

    if (this.state.showDottedUnderline) {
      inputStyle = DOMUtils.getComputeStyle(this.refs.siteTitle);
      underLineWidth = DOMUtils.getTextWidth(this.state.siteTitle, inputStyle.font);

      style = {
        width: underLineWidth,
        maxWidth: inputStyle.width
      };

      return (
        <div className='after-title-input' style={ style }/>
      );
    }

    return null;
  },

  render: function () {
    var disabled = !this.props.changable;

    return (
      <div className='site-title pull-left'>
        <input ref='siteTitle' className='site-title-input'
          type='text' value={ this.state.siteTitle }
          disabled={ disabled } onChange={ this._onTitleChange } />
        { this.renderDottedUnderline() }
      </div>
    );
  },

  _onChange: function () {
    this.setState({
      siteTitle: SessionStore.getSiteTitle()
    });
  },

  _onShareBarOrFilterTagChanged: function () {
    this.setState({
      showDottedUnderline: ShareBarStore.isActive() && !FilterTagStore.isNoFilter()
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
    }, 500);
  }

}));

module.exports = SiteTitle;
