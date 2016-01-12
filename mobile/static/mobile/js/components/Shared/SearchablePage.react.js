var objectAssign = require('object-assign');
var React = require('react');

var Base = require('components/Base.react');

var SharedSearchBar = require('components/Shared/SharedSearchBar.react');
var SearchablePageStore = require('stores/Shared/SearchablePageStore');


var SearchablePage = React.createClass(objectAssign(Base(SearchablePageStore), {
  render: function () {
    return (
      <div>
        <SharedSearchBar />
        {this.props.children}
      </div>
    )
  }
}));

module.exports = SearchablePage;
