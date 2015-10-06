var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var OfficerPageAPIUtil = require('utils/OfficerPageAPIUtil');

var OfficerPageActions = {
  getOfficerData: function (officer) {
    OfficerPageAPIUtil.getOfficerData(officer)
  }
};

module.exports = OfficerPageActions;
