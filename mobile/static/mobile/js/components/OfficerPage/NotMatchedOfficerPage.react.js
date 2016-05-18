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
            Sorry!
          </h3>
          <div className='message-content'>
            <span className='officer-id'>{ id }</span> is not in our database.
          </div>
        </div>
      </SearchablePage>
    );
  }
});

module.exports = NotMatchedOfficerPage;
