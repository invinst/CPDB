var ComplaintPageActions = require('actions/ComplaintPage/ComplaintPageActions');
var AppConstants = require('constants/AppConstants');
var AppDispatcher = require('dispatcher/AppDispatcher');

require('should');


describe('ComplaintPageActions', function () {
  it('dispatch toggle open event', function () {
    var expectedCall = {
      actionType: AppConstants.TOGGLE_PAGE_OPEN
    };
    ComplaintPageActions.toggleOpen();
    AppDispatcher.dispatch.calledWithMatch(expectedCall).should.be.true();
  });

  it('dispatch toggle close event', function () {
    var expectedCall = {
      actionType: AppConstants.TOGGLE_PAGE_CLOSE
    };
    ComplaintPageActions.toggleClose();
    AppDispatcher.dispatch.calledWithMatch(expectedCall).should.be.true();
  });

  it('dispatch reset state event', function () {
    var expectedCall = {
      actionType: AppConstants.RESET_STATE
    };
    ComplaintPageActions.resetState();
    AppDispatcher.dispatch.calledWithMatch(expectedCall).should.be.true();
  });
});
