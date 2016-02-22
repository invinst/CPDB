var CollectionUtil = {
  getMax: function (items) {
    return items.reduce(function (p, v) {
      return ( p > v ? p : v );
    }, 0);
  }
};

module.exports = CollectionUtil;
