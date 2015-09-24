var AppDispatcher = require('../../../dispatcher/AppDispatcher');
var AppConstants = require('../../../constants/AppConstants');
var _ = require('lodash');
var Base = require('../../Base');
var navigate = require('react-mini-router').navigate;

var _state = {
  story: {}
};

var StoryFormStore = _.assign(Base(_state), {

});

AppDispatcher.register(function(action) {
  switch (action.actionType) {

    case AppConstants.UPDATE_STORY_DATA:
      _state.story[action.field] = action.value;
      StoryFormStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = StoryFormStore;
