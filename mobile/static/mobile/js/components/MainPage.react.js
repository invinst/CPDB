var objectAssign = require('object-assign');
var React = require('react');

var Base = require('components/Base.react');

var About = require('components/Shared/About.react');
var MainPageStore = require('stores/MainPageStore');
var SearchResults = require('components/MainPage/SearchResults.react');
var LoadingPage = require('components/Shared/LoadingPage.react');
var HelperUtil = require('utils/HelperUtil');
var SearchComponent = require('components/MainPage/SearchComponent.react');


var MainPage = React.createClass(objectAssign(Base(MainPageStore), {
  getInitialState: function () {
    return {
      'isSearchFocused': 0,
      'isSearching': 0,
      'term': ''
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
    var term = HelperUtil.fetch(this, 'props.params.query', '');
    var isSearchFocused = this.state.isSearchFocused;

    return (
      <div className='main-page content'>
        <SearchComponent topLeft={this.props.topLeft | isSearchFocused} />
        {this.renderSearchResults(term)}
        <About topLeft={isSearchFocused}/>
      </div>
    )
  }
}));

module.exports = MainPage;
