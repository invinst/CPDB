var cx = require('classnames');
var objectAssign = require('object-assign');
var React = require('react');

var Base = require('components/Base.react');

var About = require('components/Shared/About.react');
var MainPageStore = require('stores/MainPageStore');
var Logo = require('components/Shared/Logo.react');
var SearchBar = require('components/MainPage/SearchBar.react');
var SearchResults = require('components/MainPage/SearchResults.react');
var Wrapper = require('components/Shared/Wrapper.react');
var LoadingPage = require('components/Shared/LoadingPage.react');


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
  },

  render: function () {
    var term = this.props.params.query || '';
    var isSearchFocused = this.state.isSearchFocused;
    var classNames = cx('search-wrapper animation content', {'top-left': isSearchFocused});

    return (
      <div className='main-page'>
        <Logo topLeft={isSearchFocused}/>
        <div className={classNames}>
          <SearchBar />
        </div>
        <div className='bar bar-standard bar-footer'>
          <About />
        </div>
        <Wrapper visible={!this.state.isSearching}>
          <SearchResults term={term}/>
        </Wrapper>
        <Wrapper visible={this.state.isSearching}>
          <LoadingPage />
        </Wrapper>
      </div>
    )
  }
}));

module.exports = MainPage;
