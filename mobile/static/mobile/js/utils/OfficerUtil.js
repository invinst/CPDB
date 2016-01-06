var AppConstants = require('constants/AppConstants');

var HelperUtil = require('utils/HelperUtil');


var OfficerUtil = function () {
  var getStarClass = function (allegationCount) {
    // FIXME: Refactor this function
    for (var i = 0; i < AppConstants.OFFICER_COMPLAINT_COUNT_RANGE.length; i++) {
      if (allegationCount >= AppConstants.OFFICER_COMPLAINT_COUNT_RANGE[i]) {
        return HelperUtil.format('circle-{id}', {'id': i});
      }
    }
  };

  return {
    getStarClass: getStarClass
  }
};

module.exports = OfficerUtil;