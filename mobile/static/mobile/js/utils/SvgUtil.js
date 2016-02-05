var HelperUtil = require('utils/HelpUtil');


var SvgUtil = {
  arrayToPoints: function (data, scaleX, scaleY) {
    var result = '';

    for (var i = 0; i < data.length; i++) {
      result = [result, HelperUtil.format('{i},{value}', {'i': i * scaleX, 'value': data[i] * scaleY})].join(' ');
    }

    return result;
  }
};

module.exports = SvgUtil;
