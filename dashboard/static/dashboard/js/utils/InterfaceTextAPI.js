global.jQuery = require('jquery');

var AppConstants = require('../constants/AppConstants');
var InterfaceTextActions = require('actions/InterfaceTextActions');

var ajax = null;
var limit = 0;
var count = 20;

var InterfaceTextAPI = {
  get: function (query) {
    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.getJSON(AppConstants.INTERFACE_TEXT_API_ENDPOINT, function(data) {
      InterfaceTextActions.receivedData(data.results);
    });
  },

  save: function (interfaceText) {
    if (ajax) {
      ajax.abort();
    }
    var appendURL = ""
    if (interfaceText.id) {
        appendURL += interfaceText.id + "/";
    }

    ajax = jQuery.ajax({
      type: 'PUT',
      url: AppConstants.INTERFACE_TEXT_API_ENDPOINT + appendURL,
      data: interfaceText,
      success: function(response) {
        InterfaceTextActions.update(response);
      },
      error: function (response) {
        console.log(response);
      }
    });
  }
};

module.exports = InterfaceTextAPI;
