/*eslint no-console:0*/
var AppConstants = require('../constants/AppConstants');
var InterfaceTextActions = require('actions/InterfaceTextActions');

var ajax = null;
var InterfaceTextAPI;

global.jQuery = require('jquery');


InterfaceTextAPI = {
  get: function (query) {
    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.getJSON(AppConstants.INTERFACE_TEXT_API_ENDPOINT, function (data) {
      InterfaceTextActions.receivedData(data.results);
    });
  },

  save: function (interfaceText) {
    var appendURL = '';

    if (ajax) {
      ajax.abort();
    }

    if (interfaceText.id) {
      appendURL += interfaceText.id + '/';
    }

    ajax = jQuery.ajax({
      type: 'PUT',
      url: AppConstants.INTERFACE_TEXT_API_ENDPOINT + appendURL,
      data: interfaceText,
      success: function (response) {
        InterfaceTextActions.update(response);
      },
      error: function (response) {
        console.log(response);
      }
    });
  }
};

module.exports = InterfaceTextAPI;
