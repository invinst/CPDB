var request = require('superagent');

var AppConstants = require('constants/AppConstants');

var InterfaceTextActions = require('actions/Shared/InterfaceTextActions');
var InterfaceTextUtil = require('utils/InterfaceTextUtil');


var InterfaceTextResourceUtil = {
  get: function () {
    request.get(AppConstants.INTERFACE_TEXT_API_ENDPOINT).end(function (err, res) {
      var results, interfaceTexts, interfaceText, i;
      if (res.ok) {
        results = res.body.results;
        interfaceTexts = {};

        for (i = 0; i < results.length; i++) {
          interfaceText = results[i];
          interfaceTexts[interfaceText['key']] = interfaceText['text'];
        }
        InterfaceTextUtil.saveToLocalStorage(interfaceTexts);
        InterfaceTextActions.getInterfaceTextsSucessfully(interfaceTexts);
      } else {
        InterfaceTextActions.failedToGetInterfaceTexts(err);
      }
    });
  }
};

module.exports = InterfaceTextResourceUtil;
