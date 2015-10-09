var React = require('react');

var SessionsAPI = require('utils/SessionsAPI');
var SessionList = require('components/SessionSection/SessionList.react');

var SessionSection = React.createClass({
  componentDidMount: function() {
    SessionsAPI.get()
  },

  render: function() {
    return (
      <div>
        <div className='row top-nav'>
          <div id='page-title' className='col-md-9 col-xs-9'>
            <h1>
              Sessions Management
            </h1>
          </div>
        </div>
        <div>
          <div className='row'>
          </div>
          <div className='row'>
            <div id='sessions' className='col-md-12'>
              <SessionList />
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = SessionSection;
