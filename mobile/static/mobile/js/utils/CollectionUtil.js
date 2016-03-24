var CollectionUtil = {
  getMax: function (items) {
    return items.reduce(function (p, v) {
      return ( p > v ? p : v );
    }, 0);
  },

  all: function (items) {
    return items.reduce(function (p, v) {
      return (p && !!v);
    }, true);
  },

  any: function (items) {
    return items.reduce(function (p, v) {
      return (p || v);
    }, false);
  },

  pluck: function (items, field) {
    var i = 0;
    var results = [];

    for (i = 0; i < items.length; i++) {
      results.push(items[i][field]);
    }

    return results;
  },

  isSameField: function (items, field) {
    var i = 0;
    for (i=0; i < items.length - 1; i++) {
      if (items[i][field] !== items[i+1][field]) {
        return false;
      }
    }
    return true;
  },

  isSameAllFields: function (items, fields) {
    var i = 0;
    for (i = 0; i < fields.length; i++) {
      if (!this.isSameField(items, fields[i])) {
        return false;
      }
    }
    return true;
  },

  first: function (items) {
    return items.length ? items[0] : null;
  }
};

module.exports = CollectionUtil;
