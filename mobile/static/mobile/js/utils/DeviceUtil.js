var DeviceUtil = function () {
  var isiOSDevice = function () {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  return {
    isiOSDevice: isiOSDevice()
  };
};

module.exports = DeviceUtil;
