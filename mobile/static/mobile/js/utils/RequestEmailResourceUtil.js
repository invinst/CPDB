var request = require('superagent');

var AppConstants = require('constants/AppConstants');
var RequestActions = require('actions/ComplaintPage/RequestActions');


var RequestEmailResourceUtil = {
  post: function (email, documentId) {

    request.post(AppConstants.REQUEST_EMAIL_API_EMAIL)
      .send({'email': email, 'document_id': documentId})
      .end(function (err, res) {
        if (res.ok) {
          RequestActions.requestSuccess();
        } else {
          RequestActions.requestFail();
        }
      });

  }
};

module.exports = RequestEmailResourceUtil;
