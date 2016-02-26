var sinon = require('sinon');

var ShareBarActions = require('actions/ShareBarActions');
var AppConstants = require('constants/AppConstants');
var AppDispatcher = require('dispatcher/AppDispatcher');
var SessionAPI = require('utils/SessionAPI');

require('should');


describe('ShareBar actions', function () {
  it('dispatch close share bar action', function () {
    ShareBarActions.closeShareBar();
    (AppDispatcher.dispatch.calledWithMatch({actionType: AppConstants.CLOSE_SHARE_BAR})).should.be.true();
  });

  it('create shared session when open share bar', function () {
    sinon.stub(SessionAPI, 'createSharedSession');
    ShareBarActions.openShareBar('sessionhash');
    (SessionAPI.createSharedSession.calledWith('sessionhash')).should.be.true();
    SessionAPI.createSharedSession.restore();
  });

  // TODO: should create test for SessionAPI.shareToFB but can't test promise for some reasons
});
