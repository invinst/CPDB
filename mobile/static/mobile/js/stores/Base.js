var objectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppConstants = require('../constants/AppConstants');


var cloneObject = function (obj) {
  var temp,
    key;

  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  temp = obj.constructor();
  for (key in obj) {
    temp[key] = cloneObject(obj[key]);
  }
  return temp;
};

var Base = function (state) {
  return objectAssign({}, EventEmitter.prototype, {
    _originalState: cloneObject(state),
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
    },

    recycle: function () {
      this._state = cloneObject(this._originalState);
    },

    recycleKey: function (key) {
      this._state[key] = this._originalState[key];
    }
  });
};

module.exports = Base;
