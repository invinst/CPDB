var React = require('react');
var ReactDOM = require('react-dom');


var ShareBar = React.createClass({
  inputClicked: function () {
    this.refs.urlText.select();
  },

  getTweetIntentUrl: function () {
    return [
      'https://twitter.com/intent/tweet',
      '?text=Check+out',
      '&url=' + encodeURIComponent(window.location.href),
    ].join('');
  },

  render: function () {
    return <div className="share-bar">
      <div className="share-bar__content-wrapper">
        <i className="fa fa-facebook-square"></i>
        <a href={this.getTweetIntentUrl()}>
          <i className="fa fa-twitter-square"></i>
        </a>
        <input type="text" value={window.location.href}
          readonly onClick={this.inputClicked} ref="urlText"/>
      </div>
    </div>;
  }
});

module.exports = ShareBar;
