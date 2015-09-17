var Base = require('../Base');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var _ = require('lodash');

var _state = {};

var QueryListFilterStore = _.assign(Base(_state), {
});

AppDispatcher.register(function() {
});

module.exports = QueryListFilterStore;
