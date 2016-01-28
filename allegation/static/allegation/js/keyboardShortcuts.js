var Mousetrap = require('mousetrap');
var FilterTagsAction = require('actions/FilterTagsActions');


Mousetrap.bind(['p'], function(e) {
  FilterTagsAction.toggleAllTags();
});
