var React = require('react');

var classnames = require('classnames');

var ShareBar = require('components/DataToolPage/Share/ShareBar.react');
var SessionStore = require('stores/SessionStore');
var ShareButtonStore = require('stores/DataToolPage/ShareButtonStore');
var ShareBarActions = require('actions/ShareBarActions');


var ShareButton = React.createClass({
  getInitialState: function () {
    return {
      active: false,
      sharedSessionHashId: null,
      sharedUrl: null
    };
  },

  componentDidMount: function () {
    ShareButtonStore.addChangeListener(this._onReceivedSharedSession);
  },

  componentWillUnmount: function () {
    ShareButtonStore.removeChangeListener(this._onReceivedSharedSession);
  },

  _onReceivedSharedSession: function () {
    this.setState(ShareButtonStore.getState());
  },

  toggleShareBar: function () {
    if (!this.state.active) {
      ShareBarActions.openShareBar(SessionStore.getHash());
    } else {
      ShareBarActions.closeShareBar();
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
        <button onClick={ this.toggleShareBar }>
          <i className={ buttonIconClassNames }></i>
          <span> Share</span>
        </button>
        { this.state.active ?
          <ShareBar
            sharedSessionHashId={ this.state.sharedSessionHashId }
            sharedUrl={ this.state.sharedUrl }
          />
          : null
        }
      </div>
    );
  }
});

module.exports = ShareButton;
