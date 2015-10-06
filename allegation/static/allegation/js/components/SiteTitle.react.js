var DEFAULT_SITE_TITLE = "Chicago Police Database";
var React = require('react');
var SessionStore = require("../stores/SessionStore");
var init_data = typeof(INIT_DATA) == 'undefined' ? {} : INIT_DATA;

function removeMultipleSpace(str) {
  return str.replace(/\s{2,}/g, ' ');
}

function removeNonAlphaNumeric(str) {
  return str.replace(/[^\w\s]/gi, '');
}

function slugify(title) {
  var asciiTitle = removeNonAlphaNumeric(title);
  var singleSpaceTitle = removeMultipleSpace(asciiTitle).trim();
  var lowerCaseTitle  = singleSpaceTitle.toLowerCase();

  return lowerCaseTitle.replace(/\s/g, '-').trim();
}

function updateUrlWithSlugifiedTitle(title) {
  var slugifiedTitle = slugify(title);
  var pathName = window.location.pathname;
  var newPathName = pathName.replace(/\/(.+?)\/(.+)?$/, "/$1/" + slugifiedTitle);

  window.history.pushState([], "", newPathName)
}

var SiteTitle = React.createClass({
  getInitialState: function () {
    var initial = init_data['title'] || DEFAULT_SITE_TITLE;

    return {
      text: initial
    }
  },

  render: function() {
    return (
      <input className='site-title-input' type='text' value={this.state.text} onChange={this.change} />
    )
  },

  change: function (e) {
    var newTitle = $(e.target).val();

    this.setState({ 'text': newTitle });
    SessionStore.saveSession({'title': newTitle});
    document.title = newTitle;
    updateUrlWithSlugifiedTitle(newTitle);
  },
});

module.exports = SiteTitle;
