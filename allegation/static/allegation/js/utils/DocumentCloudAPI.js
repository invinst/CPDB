require('utils/jQuery');
var StoryActions = require('actions/OfficerPage/StoryActions')


var ajax = null;

var DocumentCloudAPI = {
  getThumbnail: function (story) {
    if (ajax) {
      ajax.abort();
    }

    url = story.url.replace(/\.html$/, '.json').replace('/documents/', '/api/documents/');

    ajax = jQuery.getJSON(url, function (data) {
      StoryActions.setThumbUrl(story, data.document.resources.thumbnail);
    });
  }
};

module.exports = DocumentCloudAPI;
