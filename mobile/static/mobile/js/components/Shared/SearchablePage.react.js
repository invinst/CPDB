var objectAssign = require('object-assign');
var React = require('react');

var Base = require('components/Base.react');

var SearchBar = require('components/MainPage/SearchComponent/SearchBar.react');
var SearchablePageStore = require('stores/Shared/SearchablePageStore');
var SearchResults = require('components/MainPage/SearchResults.react');


var SearchablePage = React.createClass(objectAssign(Base(SearchablePageStore), {
  getInitialState: function () {
    return {
      'focus': 0
    }
  },

  render: function () {
    if (this.state.focus) {
      return (
        <div className='searchable-page'>
          <SearchBar />
          <SearchResults />
      </div>
      )
    }

    return (
      <div className='searchable-page'>
        <SearchBar />
        {this.props.children}
      </div>
    )
  }
}));

module.exports = SearchablePage;
