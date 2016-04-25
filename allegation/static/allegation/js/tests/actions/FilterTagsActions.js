var AppConstants = require('constants/AppConstants');
var AppDispatcher = require('dispatcher/AppDispatcher');
var FilterTagsActions = require('actions/FilterTagsActions');

require('should');


describe('FilterTags Actions', function () {
  it('should dispatch TOGGLE_STACKING_MODE', function () {
    FilterTagsActions.toggleStackingMode();
    AppDispatcher.dispatch.calledWithMatch({
      actionType: AppConstants.TOGGLE_STACKING_MODE
    }).should.be.true();
  });
});
