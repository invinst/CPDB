var AppConstants = require('constants/AppConstants');
var AppDispatcher = require('dispatcher/AppDispatcher');
var ShareButtonStore = require('stores/DataToolPage/ShareButtonStore');

require('should');


describe('ShareButtonStore', function () {

  it('becomes inactive when close share bar', function () {
    var callback = AppDispatcher.getCallback(ShareButtonStore.dispatcherIndex);
    ShareButtonStore.setActive(true);
    callback({
      actionType: AppConstants.CLOSE_SHARE_BAR
    });
    (ShareButtonStore.isActive()).should.not.be.true();
  });
});
