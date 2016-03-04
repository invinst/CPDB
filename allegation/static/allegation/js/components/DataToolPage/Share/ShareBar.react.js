var React = require('react');

var ShareBarActions = require('actions/ShareBarActions');
var SiteTitleStore = require('stores/SiteTitleStore');


var ShareBar = React.createClass({
  propTypes: {
    sharedSessionHashId: React.PropTypes.string,
    sharedUrl: React.PropTypes.string
  },

  getInitialState: function () {
    return {
      'siteTitle': SiteTitleStore.getSiteTitle()
    };
  },

  componentDidMount: function () {
    SiteTitleStore.addChangeListener(this._onSiteTitleChange);
  },

  componentWillUnmount: function () {
    SiteTitleStore.removeChangeListener(this._onSiteTitleChange);
  },

  _onSiteTitleChange: function () {
    this.setState({'siteTitle': SiteTitleStore.getSiteTitle()});
  },

  inputClicked: function () {
    this.refs.urlText.select();
  },

  getTweetIntentUrl: function () {
    return [
      'https://twitter.com/intent/tweet',
      '?text=' + encodeURIComponent(this.state.siteTitle),
      '&url=' + encodeURIComponent(this.props.sharedUrl)
    ].join('');
  },

  showFBPopup: function () {
    ShareBarActions.shareToFB(this.props.sharedSessionHashId, this.state.siteTitle, this.props.sharedUrl);
  },

  render: function () {
    return (
      <div className='share-bar'>
        <div className='share-bar-content-wrapper'>
          <a onClick={ this.showFBPopup } className='share-bar-facebook-link'>
            <i className='fa fa-facebook-square'></i>
          </a>
          <a href={ this.getTweetIntentUrl() } className='share-bar-twitter-link'>
            <i className='fa fa-twitter-square'></i>
          </a>
          <input type='text' value={ this.props.sharedUrl }
            readOnly={ true } onClick={ this.inputClicked } ref='urlText'/>
        </div>
      </div>
    );
  }
});

module.exports = ShareBar;
