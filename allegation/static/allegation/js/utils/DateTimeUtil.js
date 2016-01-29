var moment = require('moment');

var DateTimeUtil = {
  displayDateTime: function (date, format) {
    var momentDate = moment(date);

    if (momentDate.isValid()) {
      return momentDate.format(format);
    } else {
      return '';
    }
  }
};

module.exports = DateTimeUtil;
