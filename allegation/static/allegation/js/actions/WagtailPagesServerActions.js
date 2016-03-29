var WagtailPagesAPI = require('utils/WagtailPagesAPI');


var WagtailPagesServerActions = {
  initData: function () {
    WagtailPagesAPI.getGlossaryData();
  }
};

module.exports = WagtailPagesServerActions;
