var DocumentCloudAPI = require('utils/DocumentCloudAPI');


var DocumentCloudActions = {
  uploadDocument: function (data) {
    return DocumentCloudAPI.uploadDocument(data);
  }
};

module.exports = DocumentCloudActions;
