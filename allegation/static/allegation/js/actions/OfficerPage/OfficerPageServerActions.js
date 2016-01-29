var OfficerPageAPIUtil = require('utils/OfficerPageAPIUtil');

var OfficerPageActions = {
  getOfficerData: function (officer) {
    OfficerPageAPIUtil.getOfficerData(officer);
  }
};

module.exports = OfficerPageActions;
