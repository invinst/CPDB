var React = require('react');
var objectAssign = require('object-assign');

var Base = require('components/Base.react');

var FailedSearch = require('components/Shared/SearchablePage/SearchResults/FailedSearch.react');
var SuccessfulSearch = require('components/Shared/SearchablePage/SearchResults/SuccessfulSearch.react');
var Wrapper = require('components/Shared/Wrapper.react');
var SearchResultsStore = require('stores/MainPage/SearchResultsStore');
var LoadingPage = require('components/Shared/LoadingPage.react');


var SearchResults = React.createClass(objectAssign(Base(SearchResultsStore), {
  getInitialState: function () {
    return {
      'searching': 0,
      'success': false,
      'term': '',
      'suggestions': []
    };
  },

  render: function () {
    if (this.state.searching) {
      return (
        <LoadingPage />
      );
    }

    if (!this.state.success) {
      return (
        <Wrapper wrapperClass='search-results' visible={ !!this.state.term }>
          <FailedSearch term={ this.state.term } />
        </Wrapper>
      );
    }
    return (
      <Wrapper wrapperClass='search-results' visible={ !!this.state.term }>
        <SuccessfulSearch term={ this.state.term } suggestions={ this.state.suggestions } />
      </Wrapper>
    );
  }
}));

module.exports = SearchResults;
