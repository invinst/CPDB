var React = require('react');

var AppConstants = require('constants/AppConstants');
var OfficerListStore = require('stores/OfficerListStore');

var Download = React.createClass({
  getInitialState: function () {
    return {
      processing: false,
      href: false,
      query: null
    };
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

    this.setState({
      processing: true
    });

    var that = this;

    $.post('/allegations/download/?' + this.state.query, function (data) {
      var listener = null;
      listener = setInterval(function () {
        $.getJSON('/allegations/download/', {id: data.download.id}, function (result) {
          if (result.download.finished) {
            clearInterval(listener);
            var href = AppConstants.MEDIA_URL + result.download.url;
            that.setState({
              processing: false,
              href: href
            });
            location.href = href;
          }
        });
      }, 1000);
    });
  },

  componentDidMount: function () {
    OfficerListStore.addChangeListener(this.onChange);
  },

  onChange: function () {
    this.setState({
      query: OfficerListStore.getQueryString()
    });
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
});

module.exports = Download;
