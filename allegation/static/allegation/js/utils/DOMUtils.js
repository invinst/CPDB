var DOMUtils = (function () {
  var canvas = document.createElement('canvas');

  var getTextWidth = function (text, font) {
    var context, metrics;

    context = canvas.getContext('2d');
    context.font = font;
    metrics = context.measureText(text);

    return metrics.width;
  };

  return {
    getTextWidth: getTextWidth
  };
})();

module.exports = DOMUtils;
