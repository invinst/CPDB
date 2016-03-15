var _ = require('lodash');

var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var Base = require('../Base');

var _state = {
  documents: [],
  documentType: 'CR',
  locked: false,
  sortBy: 'number_of_request',
  order: -1,
  next: ''
};

var DocumentListStore = _.assign(Base(_state), {
  getSortOrder: function () {
    if (_state['sortBy']) {
      return (_state['order'] > 0 ? '' : '-') + _state['sortBy'];
    }
    return '';
  }
});

AppDispatcher.register(function (action) {
  var currentSortBy,
    order,
    sortBy,
    document;

  switch (action.actionType) {
    case AppConstants.RECEIVED_DOCUMENT_LIST:
      _state.documents = action.data;
      _state.next = action.next;
      _state.locked = false;
      DocumentListStore.emitChange();
      break;

    case AppConstants.RECEIVED_MORE_DOCUMENT_RESULTS_DATA:
      if (!_.isEmpty(action.data)) {
        _state.documents = _state.documents.concat(action.data);
        _state.next = action.next;
        _state.locked = false;
        DocumentListStore.emitChange();
      }
      break;

    case AppConstants.LOCK_SCROLL_DOCUMENT_LIST:
      _state.locked = true;
      DocumentListStore.emitChange();
      break;

    case AppConstants.DOCUMENT_REQUEST_CANCEL:
      // these seem kind of dangerous, but it works
      document = action.data;
      document.requested = false;
      document.pending = false;
      DocumentListStore.emitChange();
      break;

    case AppConstants.DOCUMENT_PUT_TO_PENDING:
      // these seem kind of dangerous, but it works
      document = action.data;
      document.pending = true;
      DocumentListStore.emitChange();
      break;

    case AppConstants.DOCUMENT_PUT_TO_REQUESTING:
      // these seem kind of dangerous, but it works
      document = action.data;
      document.pending = false;
      document.requested = true;
      DocumentListStore.emitChange();
      break;

    case AppConstants.DOCUMENT_SORT_LIST:
      currentSortBy = _state['sortBy'];
      order = _state['order'];
      sortBy = action.data;

      if (currentSortBy == sortBy) {
        order = -order;
      }

      DocumentListStore.updateState('sortBy', action.data);
      DocumentListStore.updateState('order', order);
      DocumentListStore.emitChange();
      break;

    case AppConstants.SET_ACTIVE_DOCUMENT_TYPE_TAB:
      // clear sort state
      DocumentListStore.updateState('documentType', action.data);
      break;

    default:
      break;
  }
});

module.exports = DocumentListStore;
