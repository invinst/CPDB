
var styleToNumber = function (s) {
  var numberRegex = /\d+(?:\.\d+)?/;
  var matchNumber = s.match(numberRegex);
  return matchNumber ? matchNumber[0] : 0;
};


var DOMUtils = {
  getTextWidth: function (text, font) {
    var context, metrics;
    var canvas = document.createElement('canvas');

    context = canvas.getContext('2d');
    context.font = font;
    metrics = context.measureText(text);

    return metrics.width;
  },

  getElementWidth: function (el) {
    var computedStyle = DOMUtils.getComputedStyle(el);
    return styleToNumber(computedStyle.width)
      - styleToNumber(computedStyle.paddingLeft)
      - styleToNumber(computedStyle.paddingRight);
  },

  getComputedStyle: function (el) {
    return window.getComputedStyle(el);
  },

  onResizeEnd: function (cb) {
    var rtime;
    var timeout = false;
    var delta = 200;

    function resizeend() {
      if (new Date() - rtime < delta) {
        setTimeout(resizeend, delta);
      } else {
        timeout = false;
        cb();
      }
    }

    function listener() {
      rtime = new Date();
      if (timeout === false) {
        timeout = true;
        setTimeout(resizeend, delta);
      }
    }

    window.addEventListener('resize', listener);

    return listener;
  },

  removeResizeEndListener: function (listener) {
    window.removeEventListener('resize', listener);
  }
};

module.exports = DOMUtils;
