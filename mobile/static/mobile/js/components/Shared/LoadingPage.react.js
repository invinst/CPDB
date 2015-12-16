var React = require('react');


var LoadingPage = React.createClass({
  render: function () {
    return (
      <div className='loading-page'>
        <img src='/static/mobile/img/loading.gif' />
      </div>
    )
  }
});

module.exports = LoadingPage;
