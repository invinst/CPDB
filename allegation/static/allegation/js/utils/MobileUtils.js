var AppConstants = require('constants/AppConstants');
var isMobile = require('ismobilejs');

var MobileUtils = {
  isMobileView: function () {
    return $(window).width() < AppConstants.DESKTOP_SCREEN_WIDTH && isMobile.any;
  }
};

module.exports = MobileUtils;
