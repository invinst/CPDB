var AppConstants = require('constants/AppConstants');

var HelperUtil = require('utils/HelperUtil');


var OfficerUtil = {
  getColorLevelClass: function (prefix, allegationCount) {
    // FIXME: Refactor this function
    for (var i = 0; i < AppConstants.OFFICER_COMPLAINT_COUNT_RANGE.length; i++) {
      if (allegationCount >= AppConstants.OFFICER_COMPLAINT_COUNT_RANGE[i]) {
        return HelperUtil.format('{prefix}-{id}', {'id': i, prefix: prefix});
      }
    }
  }
};

module.exports = OfficerUtil;
