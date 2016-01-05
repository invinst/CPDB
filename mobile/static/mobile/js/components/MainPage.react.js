var cx = require('classnames');
var objectAssign = require('object-assign');
var React = require('react');

var Base = require('components/Base.react');

var About = require('components/Shared/About.react');
var MainPageStore = require('stores/MainPageStore');
var Logo = require('components/Shared/Logo.react');
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
      'firstAccess': true
    }
  },

  componentDidMount: function () {
    this.state.firstAccess = false;
    MainPageStore.addChangeListener(this._onChange);
  },

  renderSearchResults: function (term) {
    if (this.state.isSearching) {
      return (
        <LoadingPage />
      )
    }

    return (
      <SearchResults term={term} />
    );
  },

  render: function () {
    var term = HelperUtil.fetch(this,'props.params.query', '');
    var isSearchFocused = this.state.isSearchFocused;
    var classNames = cx('search-wrapper animation content', {'top-left': isSearchFocused});

    return (
      <div className='main-page content'>
        <Wrapper visible={!this.props.showError || !this.state.firstAccess}>
          <Logo topLeft={isSearchFocused}/>
        </Wrapper>
        <Wrapper visible={!!this.props.showError && this.state.firstAccess}>
          <PageNotFound />
        </Wrapper>
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
