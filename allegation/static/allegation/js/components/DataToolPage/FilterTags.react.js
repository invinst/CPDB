var _ = require('lodash');
var React = require('react');
global.jQuery = require('jquery');
require('bootstrap');

var Base = require('components/Base.react');
var SessionStore = require('stores/SessionStore');
var FilterTagsActions = require('actions/FilterTagsActions');

var FilterTags = React.createClass(_.assign(Base(SessionStore), {

  removeTag: function (category, filter) {
    FilterTagsActions.removeTag(category, filter);
  },

  renderTags: function () {
    var that = this;
    return _.map(this.state.data.readable_query, function (value, category) {
      return value.map(function (filter) {
        return (
          <span className="tag tag label label-info-autocomplete fadeIn">
            {filter.text || filter}
            <span data-role="remove" onClick={that.removeTag.bind(that, category, filter)}></span>
          </span>
        );
      });
    });
  },

  render: function () {
    return (
      <div id='filter-tags'>
        { this.renderTags() }
      </div>
    );
  }
}));

module.exports = FilterTags;
