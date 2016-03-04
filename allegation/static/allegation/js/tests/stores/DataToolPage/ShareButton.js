var sinon = require('sinon');

var AppConstants = require('constants/AppConstants');
var AppDispatcher = require('dispatcher/AppDispatcher');
var ShareButtonStore = require('stores/DataToolPage/ShareButtonStore');
var locationUtils = require('utils/location');

require('should');


describe('ShareButtonStore', function () {
  var callback = AppDispatcher.getCallback(ShareButtonStore.dispatcherIndex);

  it('becomes inactive when close share bar', function () {
    ShareButtonStore.updateState('active', true);
    callback({
      actionType: AppConstants.CLOSE_SHARE_BAR
    });
    (ShareButtonStore.isActive()).should.not.be.true();
  });

  it('updates shared url when receive shared session', function () {
    sinon.stub(locationUtils, 'getWindowHref').returns('host/data/xyz567/slug');
    callback({actionType: AppConstants.RECEIVED_SHARED_SESSION, data: {data: {hash: 'abcd12'}}});
    (ShareButtonStore.getState()['sharedSessionHashId']).should.be.equal('abcd12');
    (ShareButtonStore.getState()['sharedUrl']).should.be.equal('host/data/abcd12/slug');
    locationUtils.getWindowHref.restore();
  });

  it('updates shared url when site title change', function () {
    sinon.stub(locationUtils, 'getWindowHref').returns('host/data/xyz567/slug');
    ShareButtonStore.updateState('sharedSessionHashId', 'wxy234');
    callback({actionType: AppConstants.CHANGE_SITE_TITLE, title: 'Police database'});
    (ShareButtonStore.getState()['sharedUrl']).should.be.equal('host/data/wxy234/police-database');
    locationUtils.getWindowHref.restore();
  });
});
