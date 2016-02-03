require('utils/jQuery');


var APIUtil = {
  getJSON: function (url, data, callback) {
    // Shift arguments if data argument was omitted
    // This is jQuery logic, I put it here to keep getJSON works like jQuery getJSON
    if (jQuery.isFunction(data)) {
      callback = data;
      data = undefined;
    }

    return jQuery.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      data: data,
      success: callback,
      traditional: true
    });
  }
};

module.exports = APIUtil;
