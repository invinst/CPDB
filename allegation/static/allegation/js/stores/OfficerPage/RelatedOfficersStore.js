var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');


//TODO: How to deal with duplication in OfficerPage components and DataToolPage components?
var _state = {
  'active_officers': []
};

var RelatedOfficersStore = assign({}, EventEmitter.prototype, {
  getState: function () {
    return _state;
  },

  addChangeListener: function (callback) {
    this.on(AppConstants.CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(AppConstants.CHANGE_EVENT, callback);
  },

  emitChange: function () {
    this.emit(AppConstants.CHANGE_EVENT);
  }
});

RelatedOfficersStore.dispatchEvents = AppDispatcher.register(function (action) {
  var index;

  switch (action.actionType) {
    case AppConstants.SET_ACTIVE_OFFICER_IN_OFFICER_PAGE:
      index = _state['active_officers'].indexOf(action.officer.id);

      if (index == -1) {
        _state['active_officers'].push(action.officer.id);

      }
    else {
        _state['active_officers'].splice(index, 1);
      }
      RelatedOfficersStore.emitChange();
      break;
    case AppConstants.OFFICER_COMPLAINT_LIST_RECEIVED_DATA:
      _state['active_officers'] = [];
      RelatedOfficersStore.emitChange();
      break;
    default:
      break;
  }
});


module.exports = RelatedOfficersStore;
