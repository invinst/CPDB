var OfficerAPI = require('../utils/OfficerAPI');

var OfficerSectionActions = {
  loadOfficer: function (id) {
    OfficerAPI.loadById(id);
  }
};

module.exports = OfficerSectionActions;
