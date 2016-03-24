var AppConstants = require('constants/AppConstants');
var AppDispatcher = require('dispatcher/AppDispatcher');

var ComplaintPageStore = require('stores/ComplaintPage/ComplaintPageStore');
require('should');


describe('ComplaintPageStore', function () {
  var callback = AppDispatcher.getCallback(ComplaintPageStore.dispatcherToken);

  it('updates when received complaint page data', function () {
    var crid = 'crid';
    var data = { 'allegation': { 'crid': crid } };
    var newState;


    ComplaintPageStore.updateState('loading', true);

    callback({
      actionType: AppConstants.COMPLAINT_PAGE_RECEIVED_DATA,
      data: data
    });

    newState = ComplaintPageStore.getState();
    newState.crid.should.equal(crid);
    newState.data.should.equal(data);
    newState.loading.should.be.false();
    newState.found.should.be.true();
  });

  it('updates found to false if failed to receive complaint page data', function () {
    var crid = 'crid';
    var newState;

    ComplaintPageStore.updateState('loading', true);
    ComplaintPageStore.updateState('found', true);

    callback({
      actionType: AppConstants.COMPLAINT_PAGE_FAILED_TO_RECEIVED_DATA,
      data: crid
    });

    newState = ComplaintPageStore.getState();
    newState.crid.should.equal(crid);
    newState.loading.should.be.false();
    newState.found.should.be.false();
  });
});
