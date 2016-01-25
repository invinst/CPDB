var RaceGenderAPI = require('utils/RaceGenderAPI');


var RaceGenderTabServerActions = {
  initData: function () {
    RaceGenderAPI.getData();
  }
};

module.exports = RaceGenderTabServerActions;
