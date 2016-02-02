var React = require('react');

var SessionStore = require('stores/SessionStore');


var ShareBar = React.createClass({
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
      '&url=' + encodeURIComponent(window.location.href)
    ].join('');
  },

  showFBPopup: function () {
    window.open(
      'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href),
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
          <input type='text' value={ window.location.href }
            readOnly={ true } onClick={ this.inputClicked } ref='urlText'/>
        </div>
      </div>
    );
  }
});

module.exports = ShareBar;
