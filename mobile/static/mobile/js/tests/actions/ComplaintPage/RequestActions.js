var RequestActions = require('actions/ComplaintPage/RequestActions');
var AppConstants = require('constants/AppConstants');
var AppDispatcher = require('dispatcher/AppDispatcher');

require('should');


describe('RequestActions', function () {
  describe('#requestSuccess', function () {
    it('should dispatch document request success event', function () {
      var expectedCall = {
        actionType: AppConstants.DOCUMENT_REQUEST_SUCCESS
      };

      RequestActions.requestSuccess();
      AppDispatcher.dispatch.calledWithMatch(expectedCall).should.be.true();
    });
  });

  describe('#requestFail', function () {
    it('should dispatch document request fail event', function () {
      var expectedCall = {
        actionType: AppConstants.DOCUMENT_REQUEST_FAIL
      };

      RequestActions.requestFail();
      AppDispatcher.dispatch.calledWithMatch(expectedCall).should.be.true();
    });
  });
});
