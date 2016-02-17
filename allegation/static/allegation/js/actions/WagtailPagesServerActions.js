var WagtailPagesAPI = require('utils/WagtailPagesAPI');


var WagtailPagesServerActions = {
  initData: function () {
    WagtailPagesAPI.getData();
  }
};

module.exports = WagtailPagesServerActions;
