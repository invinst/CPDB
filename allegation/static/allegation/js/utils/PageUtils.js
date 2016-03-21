var PageUtils = {
  showOverlay: function () {
    $('body').append('<div class="overlay"></div>');
  },

  hideOverlay: function () {
    $('body > .overlay').remove();
  }
};

module.exports = PageUtils;
