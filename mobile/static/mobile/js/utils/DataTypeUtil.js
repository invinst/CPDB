var DataTypeUtil = {
  isNumeric: function (val) {
    return /^\d+$/.test(val);
  }
};

module.exports = DataTypeUtil;
