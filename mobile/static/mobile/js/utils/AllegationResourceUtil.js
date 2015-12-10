var request = require('superagent');

var ComplaintPageServerActions = require('actions/ComplaintPage/ComplaintPageServerActions');

var AllegationResourceUtil = {
  get: function (crid) {
    request.get('')
      .query({ crid: crid })
      .end(function (err, res) {
        if (res.ok) {
          ComplaintPageServerActions.received(res.body)
        } else {
          ComplaintPageServerActions.failedToReceive(err)
        }
      });
  }
};

module.exports = AllegationAPIUtil;
