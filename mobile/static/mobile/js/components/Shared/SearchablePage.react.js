var cx = require('classnames');
var objectAssign = require('object-assign');
var React = require('react');

var Base = require('components/Base.react');

var SearchBar = require('components/Shared/SearchablePage/SearchBar.react');
var SearchablePageStore = require('stores/Shared/SearchablePageStore');
var SearchResults = require('components/Shared/SearchablePage/SearchResults.react');


var SearchablePage = React.createClass(objectAssign(Base(SearchablePageStore), {
  getInitialState: function () {
    return {
      'focus': 0
    };
  },

  render: function () {
    var focus = this.state.focus;
    var childrenClassName = cx('child-content', {'invisible': focus});
    var searchResultClassName = cx('result-content', {'invisible': !focus});

    return (
      <div className='searchable-page'>
        <SearchBar />
        <div className={searchResultClassName}>
          <SearchResults />
        </div>
        <div className={childrenClassName}>
          {this.props.children}
        </div>
      </div>
    );
  }
}));

module.exports = SearchablePage;
