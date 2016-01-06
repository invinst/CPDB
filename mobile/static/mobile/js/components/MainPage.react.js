var cx = require('classnames');
var objectAssign = require('object-assign');
var React = require('react');

var Base = require('components/Base.react');

var About = require('components/Shared/About.react');
var MainPageStore = require('stores/MainPageStore');
var ProjectSummary = require('components/MainPage/ProjectSummary.react');
var SearchBar = require('components/MainPage/SearchBar.react');
var SearchResults = require('components/MainPage/SearchResults.react');
var LoadingPage = require('components/Shared/LoadingPage.react');
var Wrapper = require('components/Shared/Wrapper.react');
var PageNotFound = require('components/MainPage/PageNotFound.react');
var HelperUtil = require('utils/HelperUtil');


var MainPage = React.createClass(objectAssign(Base(MainPageStore), {
  getInitialState: function () {
    return {
      'isSearchFocused': 0,
      'isSearching': 0,
      'term': '',
      'firstAccess': 1
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

  renderTopPage: function (showPageNotFound, isSearchFocused) {
    if (showPageNotFound) {
      return (
        <PageNotFound topLeft={isSearchFocused}/>
      );
    }
    return (
      <ProjectSummary topLeft={isSearchFocused}/>
    );
  },

  render: function () {
    var term = HelperUtil.fetch(this, 'props.params.query', '');
    var isSearchFocused = this.state.isSearchFocused;
    var showPageNotFound = !!this.props.showError && this.state.firstAccess;
    var classNames = cx('search-wrapper animation content', {'top-left': isSearchFocused});
    this.state.firstAccess = false;

    return (
      <div className='main-page content'>
        {this.renderTopPage(showPageNotFound, isSearchFocused)}
        <div className={classNames}>
          <SearchBar />
        </div>
        <About topLeft={isSearchFocused}/>
        {this.renderSearchResults(term)}
      </div>
    )
  }
}));

module.exports = MainPage;
