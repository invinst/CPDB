var DataTypeUtil = {
  isNumeric: function (val) {
    return /^\d+$/.test(val);
  },

  isValidCridQueryFormat: function (val) {
    return /^(cr|crid)?(\s+)?(\d+)$/.test(val.toLowerCase());
  }
};

module.exports = DataTypeUtil;
