var HelperUtil = {
  hasOwnProperty: function (obj, key) {
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (key in obj) &&
        (!(key in proto) || proto[key] !== obj[key]);
  },

  fetch: function(obj, key, defaultValue) {
    if (obj == null || typeof(obj) == 'undefined' || !this.hasOwnProperty(obj, key)) {
      return defaultValue;
    }
    return obj[key];
  }
};

module.exports = HelperUtil;
