var LocalStorageUtil = require('utils/LocalStorageUtil');


var InterfaceTextUtil = {
  getLocalStorageItem: function () {
    return LocalStorageUtil.getItem('interfaceTexts') ? JSON.parse(LocalStorageUtil.getItem('interfaceTexts')) : {};
  },

  isExpired: function () {
    var expiredTime = LocalStorageUtil.getItem('interfaceTextExpiredTime');
    return !expiredTime || expiredTime < Date.now();
  },

  isCached: function () {
    return !!LocalStorageUtil.getItem('interfaceTexts') && !this.isExpired();
  },

  saveToLocalStorage: function (interfaceTexts) {
    LocalStorageUtil.setItem('interfaceTexts', JSON.stringify(interfaceTexts));
    LocalStorageUtil.setItem('interfaceTextExpiredTime', Date.now() + 60 * 60 * 1000);
  }
};

module.exports = InterfaceTextUtil;
