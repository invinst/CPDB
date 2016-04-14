var u = require('utils/HelperUtil');


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
    return items.map(function (item) {
      return u.fetch(item, field);
    });
  },

  isSameField: function (items, field) {
    var i;

    for (i=0; i < items.length - 1; i++) {
      if (items[i][field] !== items[i+1][field]) {
        return false;
      }
    }
    return true;
  },

  isSameAllFields: function (items, fields) {
    var i;

    for (i = 0; i < fields.length; i++) {
      if (!this.isSameField(items, fields[i])) {
        return false;
      }
    }
    return true;
  },

  first: function (items) {
    return items.length ? items[0] : null;
  },

  groupBy: function (items, rule) {
    var groups = {};
    var i, group;

    for (i = 0; i < items.length; i++) {
      group = rule(items[i]);

      if (group in groups) {
        groups[group].push(items[i]);
      } else {
        groups[group] = [items[i]];
      }
    }
    return groups;
  }
};

module.exports = CollectionUtil;
