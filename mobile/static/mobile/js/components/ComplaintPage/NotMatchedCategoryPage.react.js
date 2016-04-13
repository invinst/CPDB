var React = require('react');

var HashUtil = require('utils/HashUtil');
var u = require('utils/HelperUtil');

var SearchablePage = require('components/Shared/SearchablePage.react');


var NotMatchedCategoryPage = React.createClass({
  propTypes: {
    category: React.PropTypes.string
  },

  render: function () {
    var categoryHash = u.fetch(this, 'props.category', '');
    var category = HashUtil.decode(categoryHash);

    return (
      <SearchablePage>
        <div className='not-matched-category-page container content'>
          <h3 className='message-title'>
            Invalid page!
          </h3>
          <div className='message-content'>
            The Category <span className='category-number'>{ category }</span> is not recorded in our database.
          </div>
        </div>
      </SearchablePage>
    );
  }
});

module.exports = NotMatchedCategoryPage;
