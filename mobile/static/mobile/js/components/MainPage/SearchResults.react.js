var React = require('react');
var objectAssign = require('object-assign');

var Base = require('components/Base.react');

var FailedSearch = require('components/MainPage/SearchResults/FailedSearch.react');
var SuccessfulSearch = require('components/MainPage/SearchResults/SuccessfulSearch.react');
var SearchResultsStore = require('stores/MainPage/SearchResultsStore');
var Wrapper = require('components/Shared/Wrapper.react');

var SearchResults = React.createClass(objectAssign(Base(SearchResultsStore), {
  render: function () {
    if (!this.state.success) {
      return (
        <Wrapper visible={this.state.term}>
          <FailedSearch term={this.state.term} />
        </Wrapper>
      )
    }

    return (
      <Wrapper visible={this.state.term}>
        <SuccessfulSearch term={this.state.term} suggestions={this.state.suggestions} />
      </Wrapper>
    )
  }
}));

module.exports = SearchResults;
