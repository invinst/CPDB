var _ = require('lodash');
var React = require('react');
global.jQuery = require('jquery');
require('bootstrap');
var classnames = require('classnames');

var Base = require('components/Base.react');
var SessionStore = require('stores/SessionStore');
var FilterTagsActions = require('actions/FilterTagsActions');
var FilterStore = require('stores/FilterStore');

var FilterTags = React.createClass(_.assign(Base(SessionStore), {

  removeTag: function (category, filter) {
    FilterTagsActions.removeTag(category, filter);
  },

  pinTag: function (category, filter) {
    FilterTagsActions.pinTag(category, filter);
  },

  renderTags: function () {
    var that = this;
    return _.map(this.state.data.readable_query, function (value, category) {
      return value.map(function (filter) {
        var tagClassName = classnames('tag label label-info-autocomplete fadeIn', {
          'pinned': FilterStore.isPinned(category, filter.value)
        });

        return (
          <span className={tagClassName}>
            {filter.text || filter}
            <span className='pin' onClick={that.pinTag.bind(that, category, filter)}><i className="fa fa-thumb-tack"></i></span>
            <span data-role="remove" onClick={that.removeTag.bind(that, category, filter)}></span>
          </span>
        );
      });
    });
  },

  render: function () {
    return (
      <div id='filter-tags' className="bootstrap-tagsinput">
        { this.renderTags() }
      </div>
    );
  }
}));

module.exports = FilterTags;
