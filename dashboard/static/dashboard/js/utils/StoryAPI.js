var _ = require('lodash');
var AppConstants = require('../constants/AppConstants');
var StoryListActions = require('../actions/OfficerSection/Officer/StoryListActions');
var StoryFormActions = require('../actions/OfficerSection/Officer/StoryFormActions');
var OfficerStore = require('../stores/OfficerSection/OfficerStore');

var ajax = null;
var StoryAPI;

global.jQuery = require('jquery');


StoryAPI = {

  get: function () {
    var officer,
      params;

    if (ajax) {
      ajax.abort();
    }

    officer = OfficerStore.getState().officer;
    if (!officer) {
      return;
    }

    params = {
      officer: OfficerStore.getState().officer.id
    };

    ajax = jQuery.getJSON(AppConstants.STORY_END_POINT, params, function (data) {
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
    jQuery.post(AppConstants.STORY_END_POINT, story, function (data) {
      StoryFormActions.createdStory(data);
    });
  },

  update: function (story) {
    jQuery.ajax({
      type: 'PUT',
      url: AppConstants.STORY_END_POINT + story.id + '/',
      data: story
    }).done(function (data) {
      StoryFormActions.updatedStory(data);
    });
  },

  queryDelete: function (story) {
    return jQuery.ajax({
      type: 'DELETE',
      url: AppConstants.STORY_END_POINT + story.id + '/'
    });
  },

  delete: function (story) {
    this.queryDelete(story).done(function () {
      StoryListActions.deletedStory(story);
    });
  },
  deleteBulk: function (stories) {
    var ajaxs = _.map(stories, this.queryDelete);
    jQuery.when.apply(ajaxs).done(function () {
      StoryListActions.deletedStories(stories);
    });
  },

  suggestType: function (input, callback) {
    jQuery.get(AppConstants.STORY_TYPE_END_POINT, {query: input}, function (data) {
      var options = jQuery.map(data['data'], function (value) {
        return {
          'value': value,
          'label': value
        };
      });
      callback(null, {
        options: options,
        complete: true
      });
    });
  }
};

module.exports = StoryAPI;
