var HelperUtil = require('utils/HelperUtil');


var SvgUtil = {
  arrayToPoints: function (data, scaleX, scaleY) {
    var result = '';
    var i;

    for (i = 0; i < data.length; i++) {
      result = [result, HelperUtil.format('{i},{value}', {'i': i * scaleX, 'value': data[i] * scaleY})].join(' ');
    }

    return result;
  }
};

module.exports = SvgUtil;
