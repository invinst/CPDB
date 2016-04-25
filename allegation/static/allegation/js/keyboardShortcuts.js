var Mousetrap = require('mousetrap');
var FilterTagsAction = require('actions/FilterTagsActions');


Mousetrap.bind(['shift'], function (e) {
  FilterTagsAction.toggleStackingMode();
});
