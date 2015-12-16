var HelperUtil = {
  hasOwnProperty: function (obj, key) {
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (key in obj) &&
        (!(key in proto) || proto[key] !== obj[key]);
  },

  fetch: function(obj, path, defaultValue) {
    var paths = path.split('.');

    for (var i = 0; i < paths.length; i++) {
      var key = paths[i];

      if (obj == null || typeof(obj) == 'undefined' || !this.hasOwnProperty(obj, key) || obj[key] == null) {
        return defaultValue;
      }
      obj = obj[key];
    }

    return obj;
  }
};

module.exports = HelperUtil;
