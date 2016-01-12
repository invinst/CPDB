var AppConstants = require('constants/AppConstants');


var DataTypeUtil = {
  isNumeric: function (val) {
    return /^\d+$/.test(val);
  }
};

module.exports = DataTypeUtil;
