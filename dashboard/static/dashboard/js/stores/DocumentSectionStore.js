var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var _ = require('lodash');
var Base = require('./Base');
var navigate = require('react-mini-router').navigate;

var _state = {
  documentType: 'CR'
};

var DocumentSectionStore = _.assign(Base(_state), {
  setActiveAllegation: function (document) {
    navigate('/document?id=' + document.id);
  },

  getCurrentDocumentType: function () {
    return _state.documentType;
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.SET_ACTIVE_ALLEGATION:
      DocumentSectionStore.setActiveAllegation(action.data);
      break;

    case AppConstants.SET_ACTIVE_DOCUMENT_TYPE_TAB:
      _state.documentType = action.data;
      break;

    default:
      break;
  }
});

module.exports = DocumentSectionStore;
