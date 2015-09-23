var React = require('react');
var Search = require('./OfficerSection/Search.react');
var OfficerList = require('./OfficerSection/OfficerList.react');

var OfficerSection = React.createClass({
  componentDidMount: function() {
  },

  render: function() {
    return (
      <div>
        <div className='row top-nav'>
          <div id='page-title' className='col-md-6 col-xs-6'>
            <h1>
              Officer Profile
            </h1>
          </div>
          <div id='search-officer' className='col-md-6 col-xs-6 text-right'>
            <Search />
          </div>
        </div>
        <div>
          <div className='row'>
          </div>
          <div className='row'>
            <div id='officers' className='col-md-12'>
              <OfficerList />
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = OfficerSection;
