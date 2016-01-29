require('utils/jQuery');


var APIUil = {
  getJSON: function (url, data, callback) {
    // Shift arguments if data argument was omitted
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

module.exports = APIUil;
