var sinon = require('sinon');

var AppConstants = require('constants/AppConstants');
var AppDispatcher = require('dispatcher/AppDispatcher');
var OverlayStore = require('stores/DataToolPage/OverlayStore');

require('should');


describe('OverlayStore', function () {
  var callback = AppDispatcher.getCallback(OverlayStore.dispatcherToken);

  var toggleOverlay = function () {
    callback({
      actionType: AppConstants.TOGGLE_OVERLAY
    });
  };

  it('should deactive at initial state', function () {
    OverlayStore.getState().active.should.be.false();
  });

  it('should toggle when actions said so', function () {
    toggleOverlay();
    OverlayStore.getState().active.should.be.true();
    toggleOverlay();
    OverlayStore.getState().active.should.be.false();
  });

  it('should deactive when share bar close', function () {
    sinon.stub(AppDispatcher, 'waitFor');
    toggleOverlay();
    callback({
      actionType: AppConstants.CLOSE_SHARE_BAR
    });
    OverlayStore.getState().active.should.be.false();
    AppDispatcher.waitFor.restore();
  });

  it('should active when share bar open', function () {
    sinon.stub(AppDispatcher, 'waitFor');
    callback({
      actionType: AppConstants.RECEIVED_SHARED_SESSION
    });
    OverlayStore.getState().active.should.be.true();
    AppDispatcher.waitFor.restore();
  });
});
