var jQuery = require('jquery');

var AppConstants = require('constants/AppConstants');
var DocumentRequestAnalysisAPI = require('utils/DocumentRequestAnalysisAPI');
var DocumentRequestAPI = require('utils/DocumentRequestAPI');

require('jquery.cookie');


module.exports = {
  uploadDocument: function (data) {
    var formData = new FormData();
    formData.append('title', data.title);
    formData.append('source', data.source);
    formData.append('file', data.file);
    formData.append('document_type', data.documentType);

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
      processData: false,
      success: function () {
        DocumentRequestAnalysisAPI.get();
        DocumentRequestAPI.getDocuments();
      }
    });
  }
};
