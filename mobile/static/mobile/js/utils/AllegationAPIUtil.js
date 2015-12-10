var request = require('superagent');


var AllegationAPIUtil = {
  get: function () {
    request.get('/api/allegation')
      .end(function (err, res) {
        debugger
      });
  }
}

module.exports = AllegationAPIUtil;
