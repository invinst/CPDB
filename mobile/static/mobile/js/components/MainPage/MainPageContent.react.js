var cx = require('classnames');
var React = require('react');

var SearchBar = require('components/Shared/SearchablePage/SearchBar.react');
var SearchResults = require('components/Shared/SearchablePage/SearchResults.react');
var ProjectSummary = require('components/MainPage/ProjectSummary.react');


var MainPageContent = React.createClass({
  render: function () {
    var topLeft = this.props.topLeft;
    var searchBarWrapperClassNames = cx('search-wrapper animation', {'top-left': topLeft});
    var projectSummaryClassNames = cx('main-page-content', {'top-left': topLeft});

    return (
      <div className={projectSummaryClassNames}>
        <ProjectSummary topLeft={topLeft} />
        <div className={searchBarWrapperClassNames}>
          <SearchBar />
        </div>
        <SearchResults />
      </div>
    );
  }
});

module.exports = MainPageContent;
