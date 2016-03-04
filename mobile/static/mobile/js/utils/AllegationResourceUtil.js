var request = require('superagent');

var AppConstants = require('constants/AppConstants');

var ComplaintPageServerActions = require('actions/ComplaintPage/ComplaintPageServerActions');

var AllegationResourceUtil = {
  get: function (crid) {
    request.get(AppConstants.ALLEGATION_API_ENDPOINT)
      .query({ crid: crid })
      .end(function (err, res) {
        if (res.ok) {
          ComplaintPageServerActions.received(res.body);
        } else {
          ComplaintPageServerActions.failedToReceive(crid);
        }
      });
  }
};

module.exports = AllegationResourceUtil;
