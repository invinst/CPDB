var cx = require('classnames');
var React = require('react');

var SearchBar = require('components/MainPage/SearchComponent/SearchBar.react');
var SearchResults = require('components/MainPage/SearchResults.react');
var ProjectSummary = require('components/MainPage/SearchComponent/ProjectSummary.react');


var MainPageContent = React.createClass({
  render: function () {
    var topLeft = this.props.topLeft;
    var classNames = cx('search-wrapper animation content', {'top-left': topLeft});
    var projectSummaryClassNames = cx('search-component', {'top-left': topLeft});

    return (
      <div className={projectSummaryClassNames}>
        <ProjectSummary topLeft={topLeft} />
        <div className={classNames}>
          <SearchBar />
          <SearchResults />
        </div>
      </div>
    );
  }
});

module.exports = MainPageContent;
