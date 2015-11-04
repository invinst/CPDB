var _ = require('lodash');

var AppDispatcher = require('../../../dispatcher/AppDispatcher');
var AppConstants = require('../../../constants/AppConstants');
var Base = require('../../Base');

var _state = {
  'data': {

  },
  options: {responsive: true, aspectRatio: true}
};

var NewSessionPerDayChartStore = _.assign(Base(_state), {

});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.RECEIVED_NEW_SESSIONS_DATA:
      _state['data'] = action.data;
      NewSessionPerDayChartStore.emitChange();
      break;

    default:
      break;
  }
});
module.exports = NewSessionPerDayChartStore;
