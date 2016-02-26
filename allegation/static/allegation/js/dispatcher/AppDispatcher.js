var Dispatcher = require('flux').Dispatcher;
var AppDispatcher = new Dispatcher();
var sinon, _callbacks;


// stub AppDispatcher if we're running tests
if (global.Mocha !== undefined) {
  sinon = require('sinon');
  _callbacks = [];

  AppDispatcher.register = function (callback) {
    _callbacks.push(callback);
    return _callbacks.length - 1;
  };

  AppDispatcher.getCallback = function (index) {
    return _callbacks[index];
  };

  sinon.stub(AppDispatcher, 'dispatch');
}

module.exports = AppDispatcher;
