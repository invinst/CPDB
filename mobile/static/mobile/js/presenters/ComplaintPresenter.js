var AppConstants = require('constants/AppConstants');

var HelperUtil = require('utils/HelperUtil');
var GenderPresenter = require('presenters/GenderPresenter');


var ComplaintPresenter = function (complaint) {
  var finalFinding = function () {
    var abbrFinalFinding = HelperUtil.fetch(complaint, 'final_finding', '');

    return AppConstants.FINAL_FINDINGS[abbrFinalFinding];
  };

  return {
    finalFinding: finalFinding()
  }
};

module.exports = ComplaintPresenter;
