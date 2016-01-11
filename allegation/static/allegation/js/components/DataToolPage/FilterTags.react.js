var _ = require('lodash');
var React = require('react');
require('utils/jQuery');
var classnames = require('classnames');

var Base = require('components/Base.react');
var SessionStore = require('stores/SessionStore');
var FilterTagsActions = require('actions/FilterTagsActions');
var FilterTagStore = require('stores/FilterTagStore');
var AppConstants = require('constants/AppConstants');


var FilterTags = React.createClass(_.assign(Base(FilterTagStore), {
  removeTag: function (category, item) {
    FilterTagsActions.removeTag(category, item.value, true);
    FilterTagsActions.removedTag(category, item);
  },

  pinTag: function (category, value) {
    FilterTagsActions.pinTag(category, value);
  },

  renderTags: function () {
    var that = this;
    return _.map(this.state.filters, function (items, category) {
      return items.map(function (item) {
        var tagClassName = classnames('tag label label-info-autocomplete fadeIn', {
          'pinned': item.pinned
        });

        return (
          <span className={tagClassName}>
            <a href='javascript:void(0);' className="action remove" onClick={that.removeTag.bind(that, category, item)}><i className="fa fa-times"></i></a>
            <span className="filter">
              <span className='filter-name'>{item.value}</span>
              <span className='filter-category-name'>{category}</span>
            </span>
            <span className='action pin' onClick={that.pinTag.bind(that, category, item.value)}><i className="fa fa-thumb-tack"></i></span>
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
