var objectAssign = require('object-assign');
var React = require('react');

var Base = require('components/Base.react');

var About = require('components/Shared/About.react');
var MainPageStore = require('stores/MainPageStore');
var SearchResults = require('components/MainPage/SearchResults.react');
var LoadingPage = require('components/Shared/LoadingPage.react');
var HelperUtil = require('utils/HelperUtil');
var MainPageContent = require('components/MainPage/MainPageContent.react');
var SuggestionAPI = require('utils/SuggestionAPI');


var MainPage = React.createClass(objectAssign(Base(MainPageStore), {
  getInitialState: function () {
    return {
      'isSearchFocused': 0
    }
  },

  componentDidMount: function () {
    MainPageStore.addChangeListener(this._onChange);
    var term = HelperUtil.fetch(this, 'props.params.query', '');
    if (term) {
      SuggestionAPI.get(term)
    }
  },

  render: function () {
    var isSearchFocused = this.state.isSearchFocused;

    return (
      <div className='main-page content'>
        <MainPageContent topLeft={isSearchFocused} />
        <About topLeft={isSearchFocused}/>
      </div>
    );
  }
}));

module.exports = MainPage;
