var React = require('react');

var HashUtil = require('utils/HashUtil');


var NotMatchedCategoryPage = React.createClass({
  propTypes: {
    category: React.PropTypes.string
  },

  render: function () {
    var category = HashUtil.decode(this.props.category);

    return (
      <div className='not-matched-page'>
        <h3 className='message-title'>
          Invalid page!
        </h3>
        <div className='message-content'>
          The Category <span className='category-number'>{ category }</span> is not recorded in our database.
        </div>
      </div>
    );
  }
});

module.exports = NotMatchedCategoryPage;
