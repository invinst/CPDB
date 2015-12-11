var AppConstants = require('constants/AppConstants');

var HelperUtil = require('utils/HelperUtil');
var GenderPresenter = require('presenters/GenderPresenter');


var ComplaintPresenter = function (complaint) {
  var finalFinding = function () {
    var abbrFinalFinding = HelperUtil.fetch(complaint, 'final_finding', '').toLowerCase();
    var finalFinding = HelperUtil.fetch(AppConstants.FINAL_FINDINGS, abbrFinalFinding, 'Unknown');

    return finalFinding;
  };

  return {
    finalFinding: finalFinding()
  }
};

module.exports = ComplaintPresenter;
