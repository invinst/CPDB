var _ = require('lodash');

var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var Base = require('../Base');

var _state = {
  documents: [],
  locked: false,
  sortBy: 'total_document_requests',
  order: -1
};

var DocumentListStore = _.assign(Base(_state), {
  getSortOrder: function () {
    if (_state['sortBy']) {
      return (_state['order'] > 0 ? '' : '-') + _state['sortBy'];
    }
    return '';
  },

  getCrDocumentFromAllegation: function (allegation) {
    return _.find(allegation.documents, {type: 'CR'});
  }
});

AppDispatcher.register(function (action) {
  var document;

  switch (action.actionType) {
    case AppConstants.RECEIVED_DOCUMENT_LIST:
      _state.documents = action.data;
      DocumentListStore.emitChange();
      break;

    case AppConstants.RECEIVED_MORE_DOCUMENT_RESULTS_DATA:
      if (!_.isEmpty(action.data)) {
        _state.documents = _state.documents.concat(action.data);
        _state.locked = false;
        DocumentListStore.emitChange();
      }
      break;

    case AppConstants.LOCK_SCROLL_DOCUMENT_LIST:
      _state.locked = true;
      DocumentListStore.emitChange();
      break;

    case AppConstants.DOCUMENT_REQUEST_CANCEL:
      document = DocumentListStore.getCrDocumentFromAllegation(action.data);
      if (document) {
        document.requested = false;
      }
      DocumentListStore.emitChange();
      break;

    case AppConstants.DOCUMENT_PUT_TO_PENDING:
      document = DocumentListStore.getCrDocumentFromAllegation(action.data);
      if (document) {
        document.pending = true;
      }
      DocumentListStore.emitChange();
      break;

    case AppConstants.DOCUMENT_PUT_TO_REQUESTING:
      document = DocumentListStore.getCrDocumentFromAllegation(action.data);
      if (document) {
        document.pending = false;
        document.requested = true;
      }
      DocumentListStore.emitChange();
      break;

    case AppConstants.DOCUMENT_SORT_LIST:
      var currentSortBy = _state['sortBy'];
      var order = _state['order'];
      var sortBy = action.data;

      if (currentSortBy == sortBy) {
        order = -order;
      }

      DocumentListStore.updateState('sortBy', action.data);
      DocumentListStore.updateState('order', order);
      DocumentListStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = DocumentListStore;
