var GaUtil = {
  track: function (type, category, action, label) {
    ga('send', type, category, action, label);
  }
};

module.exports = GaUtil;
