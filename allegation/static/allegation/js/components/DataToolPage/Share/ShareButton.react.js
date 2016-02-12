var React = require('react');

var classnames = require('classnames');

var ShareBar = require('components/DataToolPage/Share/ShareBar.react');
var SessionStore = require('stores/SessionStore');
var ShareBarStore = require('stores/DataToolPage/ShareBarStore');
var SessionAPI = require('utils/SessionAPI');


var ShareButton = React.createClass({
  getInitialState: function () {
    return {
      active: false,
      sharedSessionHashId: null
    };
  },

  componentDidMount: function () {
    ShareBarStore.addChangeListener(this._onReceivedSharedSession);
  },

  componentWillUnmount: function () {
    ShareBarStore.removeChangeListener(this._onReceivedSharedSession);
  },

  _onReceivedSharedSession: function () {
    this.setState({
      active: true,
      sharedSessionHashId: ShareBarStore.getSharedSessionHashId()
    });
  },

  createSharedSession: function () {
    if (this.state.active) {
      this.setState({'active': false});
    } else {
      SessionAPI.createSharedSession(SessionStore.getHash());
    }
  },

  render: function () {
    var shareButtonClassNames = classnames('share-button', 'pull-left', {
      active: this.state.active
    });

    var buttonIconClassNames = classnames('fa', {
      'fa-times': this.state.active,
      'fa-share': !this.state.active
    });

    return (
      <div className={ shareButtonClassNames }>
        <button onClick={ this.createSharedSession }>
          <i className={ buttonIconClassNames }></i>
          <span> Share</span>
        </button>
        { this.state.active ? <ShareBar sharedSessionHashId={ this.state.sharedSessionHashId } /> : null }
      </div>
    );
  }
});

module.exports = ShareButton;
