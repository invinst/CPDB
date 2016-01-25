var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var WagtailPagesAPI = require('utils/WagtailPagesAPI');


var WagtailPagesServerActions = {
  initData: function () {
    WagtailPagesAPI.getData();
  },
};

module.exports = WagtailPagesServerActions;
