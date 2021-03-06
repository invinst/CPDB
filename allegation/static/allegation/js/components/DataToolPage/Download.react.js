var _ = require('lodash');
var React = require('react');
var classnames = require('classnames');

var Base = require('components/Base.react');
var DownloadActions = require('actions/DownloadActions');
var DownloadStore = require('stores/DownloadStore');
var DownloadAPI = require('utils/DownloadAPI');


var redirect = function (href) {
  location.href = href;
};


var Download = React.createClass(_.assign(Base(DownloadStore), {
  componentDidMount: function () {
    DownloadStore.addChangeListener(this._onChange);
    DownloadStore.addHrefChangeListener(this.onChangeHref);
  },

  componentWillUnmount: function () {
    DownloadStore.removeChangeListener(this._onChange);
    DownloadStore.removeHrefChangeListener(this.onChangeHref);
  },

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

  onChangeHref: function () {
    if (this.state.href) {
      redirect(this.state.href);
    }
  },

  render: function () {
    var content = '';
    var downloadClassName;

    if (this.state.processing) {
      content = (
        <div className='progress progress-striped active'>
          <div className='progress-bar text-center'>Processing</div>
        </div>
      );
    } else {
      content = (
        <a onClick={ this.onClick } href={ this.state.href }>
          <i className='fa fa-download'></i> Download Table
        </a>
      );
    }

    downloadClassName = classnames('download-wrapper', {
      'invisible': !this.state.query
    });

    return (
      <div className={ downloadClassName }>
        { content }
      </div>
    );
  }
}));

module.exports = Download;
