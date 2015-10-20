var _ = require('lodash');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var Base = require('stores/Base');

var _state = {
};

var StoryStore = _.assign(Base(_state), {

});

module.exports = StoryStore;
