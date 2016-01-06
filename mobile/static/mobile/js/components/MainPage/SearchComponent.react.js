var cx = require('classnames');
var React = require('react');
var objectAssign = require('object-assign');

var Base = require('components/Base.react');
var SearchBar = require('components/MainPage/SearchComponent/SearchBar.react');
var FailedSearch = require('components/MainPage/SearchResults/FailedSearch.react');
var ProjectSummary = require('components/MainPage/SearchComponent/ProjectSummary.react');
var SuccessfulSearch = require('components/MainPage/SearchResults/SuccessfulSearch.react');
var SearchResultsStore = require('stores/MainPage/SearchResultsStore');
var Wrapper = require('components/Shared/Wrapper.react');


var SearchComponent = React.createClass(objectAssign(Base(SearchResultsStore), {
  render: function () {
    var topLeft = this.props.topLeft;
    var classNames = cx('search-wrapper animation content', {'top-left': topLeft});
    var projectSummaryClassNames = cx('search-component', {'top-left': topLeft});

    return (
      <div className={projectSummaryClassNames}>
        <ProjectSummary topLeft={topLeft} />
        <div className={classNames}>
          <SearchBar />
        </div>
      </div>
    )
  }
}));

module.exports = SearchComponent;
