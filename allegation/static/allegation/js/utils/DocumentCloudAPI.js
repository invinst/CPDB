var jQuery = require('utils/jQuery');
var StoryActions = require('actions/OfficerPage/StoryActions')


var DocumentCloudAPI = {
  getThumbnail: function (story) {

    url = story.url.replace(/\.html$/, '.json').replace('/documents/', '/api/documents/');

    jQuery.getJSON(url, function (data) {
      StoryActions.setThumbUrl(story, data.document.resources.thumbnail);
    });
  }
};

module.exports = DocumentCloudAPI;
