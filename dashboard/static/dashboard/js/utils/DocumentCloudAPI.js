var jQuery = require('jquery');

var AppConstants = require('constants/AppConstants');

require('jquery.cookie');


module.exports = {
  uploadDocument: function (data) {
    var formData = new FormData();
    formData.append('title', data.title);
    formData.append('source', data.source);
    formData.append('file', data.file);

    return jQuery.ajax({
      url: AppConstants.DOCUMENT_UPLOAD_API_ENDPOINT,
      type: 'POST',
      data: formData,
      headers: {
        'X-CSRFToken': jQuery.cookie('csrftoken')
      },
      async: true,
      cache: false,
      contentType: false,
      processData: false
    });
  }
};
