/**
 * Created by eastagile on 7/31/15.
 */
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var ajax = false;
var CHANGE_EVENT = 'change';

var stories = [];

var StoryListStore = assign({}, EventEmitter.prototype, {
  init: function (officer) {
    if (ajax) {
      ajax.abort();
    }
    ajax = $.get('/officer/stories/', {officer: officer.id}, function (data) {
      stories = data.stories;
      StoryListStore.emit(CHANGE_EVENT);
    });
    return this.getStories();
  },

  onChange: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  getStories: function() {
    return stories
  }
});

module.exports = StoryListStore;
