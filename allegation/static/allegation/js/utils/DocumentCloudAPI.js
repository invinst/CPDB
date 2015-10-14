var jQuery = require('jquery');
var StoryActions = require('actions/OfficerPage/StoryActions')


var ajax = null;

var DocumentCloudAPI = {
  getThumbnail: function (story) {
    if (ajax) {
      ajax.abort();
    }

    url = story.url.replace(/\.html$/, '.json');

    ajax = jQuery.getJSON(url, function (data) {
      StoryActions.setThumbUrl(story, data.resources.thumbnail);
    });
  }
};

module.exports = DocumentCloudAPI;
