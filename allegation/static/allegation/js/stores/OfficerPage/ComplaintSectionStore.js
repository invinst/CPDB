var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');


var _state = {
  'complaints': [],
  'analytics': {},
  'activeFilter': 'all'
}


var ComplaintSectionStore = assign({}, EventEmitter.prototype, {
  getState: function() {
    return _state;
  },

  addChangeListener: function(callback) {
    this.on(AppConstants.CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(AppConstants.CHANGE_EVENT, callback);
  },

  emitChange: function() {
    this.emit(AppConstants.CHANGE_EVENT);
  }
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
  case AppConstants.OFFICER_COMPLAINT_LIST_RECEIVED_DATA:
    _state['complaints'] = action.data.allegations;
    _state['analytics'] = action.data.analytics;
    break;
    
  default:
      break;
  }
  ComplaintSectionStore.emitChange()
;
});


module.exports = ComplaintSectionStore;
