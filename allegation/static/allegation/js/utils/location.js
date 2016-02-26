module.exports = {
  getWindowHref: function () {
    return window.location.href;
  },

  popup: function (url) {
    window.open(url, 'pop', 'width=600, height=400, scrollbars=no');
  }
};
