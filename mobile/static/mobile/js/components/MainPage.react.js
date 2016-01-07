var objectAssign = require('object-assign');
var React = require('react');

var Base = require('components/Base.react');

var About = require('components/Shared/About.react');
var MainPageStore = require('stores/MainPageStore');
var SearchResults = require('components/MainPage/SearchResults.react');
var LoadingPage = require('components/Shared/LoadingPage.react');
var HelperUtil = require('utils/HelperUtil');
var SearchComponent = require('components/MainPage/SearchComponent.react');
var SuggestionAPI = require('utils/SuggestionAPI')


var MainPage = React.createClass(objectAssign(Base(MainPageStore), {
  getInitialState: function () {
    return {
      'isSearchFocused': 0,
      'isSearching': 0,
      'term': ''
    }
  },

  componentDidMount: function () {
    MainPageStore.addChangeListener(this._onChange);
    var term = HelperUtil.fetch(this, 'props.params.query', '');
    if (term) {
      SuggestionAPI.get(term)
    }
  },

  renderSearchResults: function (term) {
    if (this.state.isSearching) {
      return (
        <LoadingPage />
      )
    }

    return (
      <SearchResults term={term}/>
    );
  },

  render: function () {
    var isSearchFocused = this.state.isSearchFocused;
    var term = HelperUtil.fetch(this, 'props.params.query', '');

    return (
      <div className='main-page content'>
        <SearchComponent topLeft={isSearchFocused} />
        {this.renderSearchResults(term)}
        <About topLeft={isSearchFocused}/>
      </div>
    );
  }
}));

module.exports = MainPage;
