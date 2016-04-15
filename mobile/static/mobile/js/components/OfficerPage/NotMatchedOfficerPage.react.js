var React = require('react');

var SearchablePage = require('components/Shared/SearchablePage.react');


var NotMatchedOfficerPage = React.createClass({
  propTypes: {
    id: React.PropTypes.number
  },

  render: function () {
    var id = this.props.id;

    return (
      <SearchablePage>
        <div className='not-matched-officer-page container content'>
          <h3 className='message-title'>
            Invalid page!
          </h3>
          <div className='message-content'>
            The id <span className='officer-id'>{ id }</span> is not recorded in out database. Please use
            search bar for new search session.
          </div>
        </div>
      </SearchablePage>
    );
  }
});

module.exports = NotMatchedOfficerPage;
