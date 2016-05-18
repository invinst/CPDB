// A very quick pub-sub implementation
var SimpleEventSystem = function () {
  var _callbacks = {};

  return {
    'register': function (e, callback) {
      if (!_callbacks[e]) {
        _callbacks[e] = [callback];
      } else {
        _callbacks[e].push(callback);
      }
    },

    'unregister': function (e) {
      _callbacks[e] = [];
    },

    'dispatch': function (target, payload) {
      var i = 0;
      var callbacks = _callbacks[target];

      if (callbacks) {
        for (i; i < callbacks.length; i++) {
          callbacks[i](payload);
        }
      }
    },

    'getCallbacks': function () {
      return _callbacks;
    }
  };
};

module.exports = SimpleEventSystem;
