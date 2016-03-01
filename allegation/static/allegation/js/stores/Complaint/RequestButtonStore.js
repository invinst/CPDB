/**
 * Created by eastagile on 7/31/15.
 */
var assign = require('object-assign');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var RequestDocumentConstants = require('../../constants/RequestDocumentConstants');
var EventEmitter = require('events').EventEmitter;

var setRequestedCrid = function (crid) {
  $.cookie('requested_document_' + crid, '1', {path: '/'});
};

var isCridRequested = function (crid) {
  return $.cookie('requested_document_' + crid);
};


var RequestButtonStore = assign({}, EventEmitter.prototype, {
  init: function (allegation) {
    return {
      requested: isCridRequested(allegation.crid) || allegation.document_requested
    };
  },

  registerButton: function (obj) {
    obj.token = AppDispatcher.register(function (action) {
      if (action.actionType == RequestDocumentConstants.DOCUMENT_REQUESTED) {
        if (obj.props.complaint.allegation.crid == action.value) {
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
    setRequestedCrid(action.value);
  }
});

module.exports = RequestButtonStore;
