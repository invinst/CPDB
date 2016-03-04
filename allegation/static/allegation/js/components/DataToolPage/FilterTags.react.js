var _ = require('lodash');
var React = require('react');
var classnames = require('classnames');

var Base = require('components/Base.react');
var FilterTagsActions = require('actions/FilterTagsActions');
var FilterTagStore = require('stores/FilterTagStore');


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
      return items.map(function (item, key) {
        var tagClassName = classnames('tag label label-info-autocomplete fadeIn', {
          'pinned': item.pinned
        });

        return (
          <span className={ tagClassName } key={ key }>
            <a href='javascript:void(0);'
              className='action remove'
              onClick={ that.removeTag.bind(that, category, item) }>
              <i className='fa fa-times'></i>
            </a>
            <span className='filter'>
              <span className='filter-name'>{ item.displayValue }</span>
              <span className='filter-category-name'>{ item.displayCategory }</span>
            </span>
            <span className='action pin' onClick={ that.pinTag.bind(that, category, item.value) }>
              <i className='fa fa-thumb-tack'></i>
            </span>
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
