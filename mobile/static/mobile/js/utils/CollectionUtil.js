var CollectionUtil = {
  getMax: function (items) {
    return items.reduce(function (p, v) {
      return ( p > v ? p : v );
    });
  }
};

module.exports = CollectionUtil;
