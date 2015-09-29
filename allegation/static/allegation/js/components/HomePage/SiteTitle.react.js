var _ = require('lodash');
var $ = require('jquery');
var React = require('react');

var AppConstants = require('constants/AppConstants');
var Base = require('components/Base.react');
var SessionAPI = require('utils/SessionAPI');
var SessionActions = require('actions/SessionActions');
var SessionStore = require("stores/SessionStore");
var StringUtil = require('utils/StringUtil');

var _timeout = false;

function updateUrlWithSlugifiedTitle(hash, title) {
  var slugifiedTitle = StringUtil.slugify(title);
  window.history.pushState([], "", "#!/" + hash + "/" + slugifiedTitle);
}

var SiteTitle = React.createClass(_.assign(Base(SessionStore), {
  componentDidMount: function() {
    SessionStore.addChangeListener(this._onChange);
  },

  componentWillUpdate: function () {
    var title = this.state.data.title;
    document.title = title;
    updateUrlWithSlugifiedTitle(this.state.data.hash, title);
  },

  render: function() {
    return (
      <input className='site-title-input' type='text' value={this.state.data.title} onChange={this._onTitleChange} />
    )
  },

  _onTitleChange: function (e) {
    var newTitle = $(e.target).val();
    if (_timeout) {
      clearTimeout(_timeout);
    }

    SessionActions.updateTitle(newTitle);

    _timeout = setTimeout(function () {
      SessionAPI.updateSessionInfo({'title': newTitle});
    }, 500)
  },

}));

module.exports = SiteTitle;
