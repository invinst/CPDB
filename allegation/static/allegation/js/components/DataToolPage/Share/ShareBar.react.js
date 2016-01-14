var React = require('react');


var ShareBar = React.createClass({
  inputClicked: function() {
    this.refs.urlText.select();
  },

  render: function () {
    return <div className="share-bar">
      <div className="share-bar__content-wrapper">
        <i className="fa fa-facebook-square"></i>
        <i className="fa fa-twitter-square"></i>
        <input type="text" value={window.location.href}
          readonly onClick={this.inputClicked} ref="urlText"/>
      </div>
    </div>;
  }
});

module.exports = ShareBar;
