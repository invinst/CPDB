var StoryListActions = require('actions/OfficerPage/StoryListActions');

var StoryListAPI = {
  get: function (officerId) {
    jQuery.get('/officer/stories/', {officer: officerId}, function (data) {
      StoryListActions.receiveStories(data.stories);
    });
  }
};

module.exports = StoryListAPI;
