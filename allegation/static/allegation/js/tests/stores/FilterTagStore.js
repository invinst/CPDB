var _ = require('lodash');

var AppConstants = require('constants/AppConstants');
var AppDispatcher = require('dispatcher/AppDispatcher');
var FilterTagStore = require('stores/FilterTagStore');

require('should');


describe('FilterTag store', function () {
  var callback = AppDispatcher.getCallback(FilterTagStore.dispatcherToken);
  var n = 0;
  var createTag = function () {
    n++;
    return {
      value: 'value_' + n,
      category: 'category_' + n,
      displayValue: 'displayValue_' + n,
      displayCategory: 'displayCategory_' + n
    };
  };

  var getAllTagsPinnedValue = function () {
    return _.pluck(
      _.flatten(_.values(FilterTagStore.getState().filters))
      , 'pinned');
  };

  it('should toggle stacking state', function () {
    FilterTagStore.updateState('filters',{
      a: [createTag()],
      b: [createTag()]
    });

    // enable stacking mode
    callback({actionType: AppConstants.TOGGLE_STACKING_MODE});
    FilterTagStore.isStacking().should.be.ok();
    getAllTagsPinnedValue().should.deepEqual([true, true]);

    callback({
      actionType: AppConstants.ADD_TAG,
      tagValue: createTag()
    });
    getAllTagsPinnedValue().should.deepEqual([true, true, true]);

    // disable stacking mode
    callback({actionType: AppConstants.TOGGLE_STACKING_MODE});
    FilterTagStore.isStacking().should.not.be.ok();

    callback({
      actionType: AppConstants.ADD_TAG,
      tagValue: createTag()
    });
    getAllTagsPinnedValue().should.deepEqual(
      [false, false, false, false]
    );
  });
});
