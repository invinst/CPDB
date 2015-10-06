var React = require('react');

var LoadingComplaintList = React.createClass({
  render: function () {
    return (
      <div className="complaint_list">
        <div className='row'>
          <div className='col-md-2'>
            <h3 className="margin-top-0">Complaints</h3>
          </div>
        </div>
        <div className='row'>
          <div id='loading' className='center'>
            <i className="fa fa-spinner fa-spin fa-2x"></i>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = LoadingComplaintList;
