var React = require('react');

var RequestModal = require('components/DataToolPage/Complaint/RequestModal.react');
var ComplaintList = require('components/DataToolPage/ComplaintList.react');

var Content = React.createClass({

  render: function() {
    var loading = this.props.loading;

    if (loading) {
      return (
        <div id='loading' className='center'>
          <i className="fa fa-spinner fa-spin fa-2x"></i>
        </div>
      );
    }

    return (
      <div>
        <ComplaintList officer={this.props.officer} complaints={this.props.complaints} />
        <RequestModal />
      </div>
    )
  }

});

module.exports = Content;
