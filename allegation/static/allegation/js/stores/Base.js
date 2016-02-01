var AppConstants = require('../constants/AppConstants');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');


var Base = function (state) {
  return _.assign({}, EventEmitter.prototype, {
    _state: state,

    getState: function () {
      return this._state;
    },

    updateState: function (key, value) {
      this._state[key] = value;
    },

    addChangeListener: function (callback) {
      this.on(AppConstants.CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
      this.removeListener(AppConstants.CHANGE_EVENT, callback);
    },

    emitChange: function () {
      this.emit(AppConstants.CHANGE_EVENT);
    }
  });
};

module.exports = Base;
