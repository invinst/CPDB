var AppConstants = require('constants/AppConstants');
var AppDispatcher = require('dispatcher/AppDispatcher');

var RequestStore = require('stores/ComplaintPage/RequestStore');

require('should');


describe('RequestStore', function () {
  var callback = AppDispatcher.getCallback(RequestStore.dispatcherToken);

  it('should update requested to true if request document success', function () {
    RequestStore.updateState('requested', false);

    callback({
      actionType: AppConstants.DOCUMENT_REQUEST_SUCCESS
    });

    RequestStore.getState().requested.should.be.true();
  });

  it('should update submitFailed to true if request document fail', function () {
    var errors = {'errorType': 'errorMsg'};
    RequestStore.updateState('submitFailed', false);

    callback({
      actionType: AppConstants.DOCUMENT_REQUEST_FAIL,
      errors: errors
    });

    RequestStore.getState().submitFailed.should.be.true();
    RequestStore.getState().errors.should.be.eql(errors);
  });
});
