var LocalStorageUtil = {
  getItem: function (key) {
    localStorage.getItem(key);
  },

  setItem: function (key, value) {
    localStorage.setItem(key, value);
  }
};

module.exports = LocalStorageUtil;
