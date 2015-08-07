/**
 * Created by eastagile on 8/6/15.
 */
var React = require('react');


var Download = React.createClass({
  getInitialState: function () {
    return {
      processing: false,
      href: false
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

    $.post('/allegations/download/?' + this.props.query, function (data) {
      var listener = null;
      listener = setInterval(function () {
        $.getJSON('/allegations/download/', {id: data.download.id}, function (result) {
          if (result.download.finished) {
            clearInterval(listener);
            var href = MEDIA_URL + result.download.url;
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
  render: function () {
    var content = '';
    if (this.state.processing) {
      content = (
        <div className="progress progress-striped active">
          <div className="progress-bar text-center">Processing</div>
        </div>
      );
    } else {
      content = (
        <a onClick={this.onClick} href={this.state.href} className='btn btn-black btn-download'>Download Table</a>
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
