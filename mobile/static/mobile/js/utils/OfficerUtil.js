var AppConstants = require('constants/AppConstants');

var HelperUtil = require('utils/HelperUtil');


var OfficerUtil = {
  getColorLevelClass: function (prefix, allegationCount) {
    var i;

    if (allegationCount < 0) {
      return '';
    }

    // FIXME: Refactor this function
    for (i = 0; i < AppConstants.OFFICER_COMPLAINT_COUNT_RANGE.length; i++) {
      if (allegationCount >= AppConstants.OFFICER_COMPLAINT_COUNT_RANGE[i]) {
        return HelperUtil.format('{prefix}-{id}', {'id': i, prefix: prefix});
      }
    }
  }
};

module.exports = OfficerUtil;
