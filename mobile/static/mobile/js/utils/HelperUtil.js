var HelperUtil = {
  hasOwnProperty: function (obj, key) {
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (key in obj) &&
      (!(key in proto) || proto[key] !== obj[key]);
  },

  fetch: function (obj, path, defaultValue) {
    var paths = path.split('.');
    var i,
      key;

    for (i = 0; i < paths.length; i++) {
      key = paths[i];

      if (!obj || !this.hasOwnProperty(obj, key) || obj[key] == null || !obj[key]) {
        return defaultValue;
      }
      obj = obj[key];
    }

    return obj;
  },

  format: function (str, replacements) {
    var re = /{([^{}]+)}/g;

    return str.replace(re, function (match, val) {
      var prop = replacements;
      val.split('.').forEach(function (key) {
        prop = prop[key];
      });

      return prop;
    });
  }
};

module.exports = HelperUtil;
