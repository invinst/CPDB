var React = require('react');

var SessionStore = require('stores/SessionStore');


var ShareBar = React.createClass({
  propTypes: {
    sharedSessionHashId: React.PropTypes.string
  },

  getInitialState: function () {
    return {
      'siteTitle': SessionStore.getTitle()
    };
  },

  componentDidMount: function () {
    SessionStore.addChangeListener(this._onSessionChange);
  },

  componentWillUnmount: function () {
    SessionStore.removeChangeListener(this._onSessionChange);
  },

  sharedUrl: function () {
    return window.location.href.replace(/data\/\w+/, 'data/' + this.props.sharedSessionHashId);
  },

  _onSessionChange: function () {
    this.setState({'siteTitle': SessionStore.getTitle()});
  },

  inputClicked: function () {
    this.refs.urlText.select();
  },

  getTweetIntentUrl: function () {
    return [
      'https://twitter.com/intent/tweet',
      '?text=' + encodeURIComponent(this.state.siteTitle),
      '&url=' + encodeURIComponent(this.sharedUrl())
    ].join('');
  },

  showFBPopup: function () {
    window.open(
      'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(this.sharedUrl()),
      'pop', 'width=600, height=400, scrollbars=no'
    );
  },

  render: function () {
    return (
      <div className='share-bar'>
        <div className='share-bar__content-wrapper'>
          <a onClick={ this.showFBPopup }>
            <i className='fa fa-facebook-square'></i>
          </a>
          <a href={ this.getTweetIntentUrl() }>
            <i className='fa fa-twitter-square'></i>
          </a>
          <input type='text' value={ this.sharedUrl() }
            readOnly={ true } onClick={ this.inputClicked } ref='urlText'/>
        </div>
      </div>
    );
  }
});

module.exports = ShareBar;
