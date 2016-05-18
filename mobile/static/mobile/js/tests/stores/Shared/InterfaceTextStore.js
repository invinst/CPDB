var AppConstants = require('constants/AppConstants');
var AppDispatcher = require('dispatcher/AppDispatcher');

var InterfaceTextStore = require('stores/Shared/InterfaceTextStore');

require('should');


describe('InterfaceTextStore', function () {
  var callback = AppDispatcher.getCallback(InterfaceTextStore.dispatcherToken);

  it('should update loaded to true if data is already loaded', function () {
    InterfaceTextStore.updateState('loaded', false);

    callback({
      actionType: AppConstants.GET_INTERFACE_TEXT_SUCCESS
    });

    InterfaceTextStore.getState().loaded.should.be.true();
  });

  it('should update loaded to false if data is not loaded yet', function () {
    InterfaceTextStore.updateState('loaded', true);

    callback({
      actionType: AppConstants.GET_INTERFACE_TEXT_FAILED
    });

    InterfaceTextStore.getState().loaded.should.be.false();
  });
});
