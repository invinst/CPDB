var _ = require('lodash');
var $ = require('jquery');
var React = require('react');

var AppConstants = require('constants/AppConstants');
var Base = require('components/Base.react');
var SessionAPI = require('utils/SessionAPI');
var SessionStore = require("stores/SessionStore");
var StringUtil = require('utils/StringUtil');


function updateUrlWithSlugifiedTitle(title) {
  var slugifiedTitle = StringUtil.slugify(title);
  var pathName = window.location.pathname;
  var newPathName = pathName.replace(/\/(.+?)\/(.+)?$/, "/$1/" + slugifiedTitle);

  window.history.pushState([], "", newPathName)
}

var SiteTitle = React.createClass(_.assign(Base(SessionStore), {
  render: function() {
    console.log(this.state);
    var title = this.state.data.title || AppConstants.DEFAULT_SITE_TITLE;

    return (
      <input className='site-title-input' type='text' value={title} onChange={this._onTitleChange} />
    )
  },

  _onTitleChange: function (e) {
    if(e) {
      var newTitle = $(e.target).val();
      console.log(newTitle);
      this.setState({'text': newTitle});
      SessionAPI.updateSessionInfo({'title': newTitle});

      document.title = newTitle;
      updateUrlWithSlugifiedTitle(newTitle);
    }
  },
}));

module.exports = SiteTitle;
