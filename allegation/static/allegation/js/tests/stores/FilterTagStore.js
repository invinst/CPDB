var _ = require('lodash');

var AppConstants = require('constants/AppConstants');
var AppDispatcher = require('dispatcher/AppDispatcher');
var FilterTagStore = require('stores/FilterTagStore');
var createTagValue = require('test_utils/Factory').createTagValue;

require('should');


describe('FilterTag store', function () {
  var callback = AppDispatcher.getCallback(FilterTagStore.dispatcherToken);

  var getAllTagsPinnedValue = function () {
    return _.pluck(
      _.flatten(_.values(FilterTagStore.getState().filters))
      , 'pinned');
  };

  it('should toggle stacking state', function () {
    FilterTagStore.updateState('filters',{
      a: [createTagValue()],
      b: [createTagValue()]
    });

    // enable stacking mode
    callback({actionType: AppConstants.TOGGLE_STACKING_MODE});
    FilterTagStore.isStacking().should.be.ok();
    getAllTagsPinnedValue().should.deepEqual([true, true]);

    callback({
      actionType: AppConstants.ADD_TAG,
      tagValue: createTagValue()
    });
    getAllTagsPinnedValue().should.deepEqual([true, true, true]);

    // disable stacking mode
    callback({actionType: AppConstants.TOGGLE_STACKING_MODE});
    FilterTagStore.isStacking().should.not.be.ok();
    getAllTagsPinnedValue().should.deepEqual(
      [false, false, false]
    );

    callback({
      actionType: AppConstants.ADD_TAG,
      tagValue: createTagValue()
    });
    getAllTagsPinnedValue().should.deepEqual(
      [false, false, false, false]
    );
  });
});
