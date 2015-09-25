var _ = require('lodash');
var AppConstants = require('../constants/AppConstants');
global.jQuery = require('jquery');
var StoryListActions = require('../actions/OfficerSection/Officer/StoryListActions');
var StoryFormActions = require('../actions/OfficerSection/Officer/StoryFormActions');
var OfficerStore = require('../stores/OfficerSection/OfficerStore');

var ajax = null;

var StoryAPI = {

  get: function() {
    if (ajax) {
      ajax.abort();
    }
    var params = {
      officer: OfficerStore.getState().officer.id
    };

    ajax = jQuery.getJSON(AppConstants.STORY_END_POINT, params, function(data) {
      StoryListActions.receivedStoryList(data.results);
    });
  },

  save: function (story) {
    if (story.id) {
      this.update(story);
    } else {
      this.create(story);
    }
  },

  create: function (story) {
    jQuery.post(AppConstants.STORY_END_POINT, story, function(data) {
      StoryFormActions.createdStory(data);
    });
  },

  update: function (story) {
    jQuery.ajax({
      type: 'PUT',
      url: AppConstants.STORY_END_POINT + story.id + '/',
      data: story
    }).done(function(data) {
      StoryFormActions.updatedStory(data);
    });
  },

  queryDelete: function (story) {
    return jQuery.ajax({
      type: 'DELETE',
      url: AppConstants.STORY_END_POINT + story.id + '/',
    });
  },

  delete: function (story) {
    this.queryDelete(story).done(function() {
      StoryListActions.deletedStory(story);
    });
  },
  deleteBulk: function (stories) {
    var ajaxs = _.map(stories, this.queryDelete);
    jQuery.when.apply(ajaxs).done(function () {
      StoryListActions.deletedStories(stories);
    })
  }
};

module.exports = StoryAPI;
