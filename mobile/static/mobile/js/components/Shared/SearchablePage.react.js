var objectAssign = require('object-assign');
var React = require('react');

var Base = require('components/Base.react');

var SearchBar = require('components/MainPage/SearchComponent/SearchBar.react');
var SearchResults = require('components/MainPage/SearchResults.react'); // TODO: Change this
var SearchablePageStore = require('stores/Shared/SearchablePageStore');


var SearchablePage = React.createClass(objectAssign(Base(SearchablePageStore), {
  getInitialState: function () {
    return {
      'focus': 0
    }
  },

  render: function () {
    if (this.state.focus) {
      return (
        <div>
          <SearchBar />
          <SearchResults />
      </div>
      )
    }

    return (
      <div>
        <SearchBar />
        {this.props.children}
      </div>
    )
  }
}));

module.exports = SearchablePage;
