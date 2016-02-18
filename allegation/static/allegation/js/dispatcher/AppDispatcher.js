var Dispatcher = require('flux').Dispatcher;
var AppDispatcher = new Dispatcher();


// spy on AppDispatcher if we're running tests
if (global.Mocha !== undefined) {
  var sinon = require('sinon');
  var _callbacks = [];

  AppDispatcher.register = function (callback) {
    _callbacks.push(callback);
    return _callbacks.length - 1;
  };

  AppDispatcher.getCallback = function (index) {
    return _callbacks[index];
  };

  sinon.spy(AppDispatcher, 'dispatch');
}

module.exports = AppDispatcher;
