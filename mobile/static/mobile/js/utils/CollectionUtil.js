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
  }
};

module.exports = CollectionUtil;
