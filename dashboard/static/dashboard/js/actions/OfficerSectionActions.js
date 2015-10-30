var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var OfficerAPI = require('../utils/OfficerAPI');

var OfficerSectionActions = {
  loadOfficer: function (id) {
    OfficerAPI.loadById(id);
  }
};

module.exports = OfficerSectionActions;
