var moment = require('moment');

var AppConstants = require('constants/AppConstants');


var DateUtil = {
  sanitizeDate : function (date, inputFormat) {
    var momentDate;
    inputFormat = inputFormat || AppConstants.SIMPLE_SERVER_DATE_FORMAT;

    momentDate = moment(date, inputFormat);

    return momentDate.isValid() ? momentDate : null;
  }
};

module.exports = DateUtil;
