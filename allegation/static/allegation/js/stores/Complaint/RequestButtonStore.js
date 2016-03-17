var assign = require('object-assign');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var RequestDocumentConstants = require('../../constants/RequestDocumentConstants');
var EventEmitter = require('events').EventEmitter;
var RequestButtonStore;

function setRequestedDocument(id) {
  $.cookie('requested_document_' + id, '1', {path: '/'});
}

function isDocumentRequested(id) {
  return $.cookie('requested_document_' + id);
}


RequestButtonStore = assign({}, EventEmitter.prototype, {
  init: function (document) {
    return {
      requested: isDocumentRequested(document.id) || document.requested
    };
  },

  registerButton: function (obj) {
    var document = obj.props.document;

    obj.token = AppDispatcher.register(function (action) {
      if (action.actionType == RequestDocumentConstants.DOCUMENT_REQUESTED) {
        if (document.id == action.id) {
          obj.setState({
            requested: true
          });
        }
      }
    });
  },

  unregisterButton: function (obj) {
    AppDispatcher.unregister(obj.token);
  }
});


AppDispatcher.register(function (action) {
  if (action.actionType == RequestDocumentConstants.DOCUMENT_REQUESTED) {
    setRequestedDocument(action.id);
  }
});

module.exports = RequestButtonStore;
