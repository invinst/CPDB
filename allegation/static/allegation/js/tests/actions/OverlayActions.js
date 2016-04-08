var OverlayActions = require('actions/DataToolPage/OverlayActions');
var AppConstants = require('constants/AppConstants');
var AppDispatcher = require('dispatcher/AppDispatcher');

require('should');


describe('Overlay Actions', function () {
  it('should dispatch toggle overlay', function () {
    OverlayActions.toggleOverlay();
    AppDispatcher.dispatch.calledWithMatch({
      actionType: AppConstants.TOGGLE_OVERLAY
    }).should.be.true();
  });
});
