var React = require('react');
var _ = require('lodash');

var Base = require('components/Base.react');
var AppConstants = require('constants/AppConstants');
var DownloadActions = require('actions/DownloadActions');
var DownloadStore = require('stores/DownloadStore');
var DownloadAPI = require('utils/DownloadAPI');


global.redirect = function (href) {
  location.href = href;
}


var Download = React.createClass(_.assign(Base(DownloadStore), {

  onClick: function (e) {
    e.preventDefault();

    if (this.state.processing) {
      return;
    }

    if (this.state.href) {
      location.href = this.state.href;
      return;
    }

    DownloadAPI.process(this.state.query);
    DownloadActions.process();

  },

  componentDidUpdate: function () {
    if (this.state.href) {
      redirect(this.state.href);
    }
  },

  render: function () {
    var content = '';
    if (!this.state.query) {
      return <div className="hidden"></div>
    }
    if (this.state.processing) {
      content = (
        <div className="progress progress-striped active">
          <div className="progress-bar text-center">Processing</div>
        </div>
      );
    } else {
      content = (
        <a onClick={this.onClick} href={this.state.href}>
          <i className="fa fa-download"></i> Download Table
        </a>
      )
    }
    return (
      <div className="download-wrapper">
        {content}
      </div>
    );
  }
}));

module.exports = Download;
