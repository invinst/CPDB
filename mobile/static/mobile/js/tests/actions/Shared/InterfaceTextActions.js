var InterfaceTextActions = require('actions/Shared/InterfaceTextActions');
var AppConstants = require('constants/AppConstants');
var AppDispatcher = require('dispatcher/AppDispatcher');

require('should');


describe('InterfaceTextActions', function () {
  describe('#getInterfaceTextSuccessfully', function () {
    it('should dispatch get interface text success event', function () {
      var expectedCall = {
        actionType: AppConstants.GET_INTERFACE_TEXT_SUCCESS
      };

      InterfaceTextActions.getInterfaceTextsSucessfully();
      AppDispatcher.dispatch.calledWithMatch(expectedCall).should.be.true();
    });
  });

  describe('#failedToGetInterfaceTexts', function () {
    it('should dispatch get interface text failed event', function () {
      var expectedCall = {
        actionType: AppConstants.GET_INTERFACE_TEXT_FAILED
      };

      InterfaceTextActions.failedToGetInterfaceTexts();
      AppDispatcher.dispatch.calledWithMatch(expectedCall).should.be.true();
    });
  });
});
