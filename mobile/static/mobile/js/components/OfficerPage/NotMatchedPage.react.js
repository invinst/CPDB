var React = require('react');


var NotMatchedPage = React.createClass({
  render: function () {
    var id = this.props.id;

    return (
      <div className='not-matched-page'>
        <h3 className='message-title'>
          Invalid page!
        </h3>
        <div className='message-content'>
          The id <span className='officer-id'>{id}</span> is not recorded in out database. Please use
          search box for new search session.
        </div>
      </div>
    )
  }
});

module.exports = NotMatchedPage;
