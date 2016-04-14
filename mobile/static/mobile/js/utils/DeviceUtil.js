var DeviceUtil = {
  getUserAgent: function () {
    return navigator.userAgent;
  },

  isiOSDevice: function () {
    return /iPhone|iPad|iPod/i.test(this.getUserAgent());
  }
};

module.exports = DeviceUtil;
