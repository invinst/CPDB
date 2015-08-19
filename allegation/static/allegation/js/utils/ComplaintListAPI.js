var ComplaintListServerActions = require('../actions/ComplaintList/ComplaintListServerActions');
var AllegationFetcherQueryBuilder = require('./AllegationFetcherQueryBuilder');
var ajax = null;

var ComplaintListAPI = {
  getData: function () {
    var queryString = AllegationFetcherQueryBuilder.buildQuery();

    if (queryString) {
      if (ajax) {
        ajax.abort();
      }

      ajax = $.getJSON('/api/allegations/?' + queryString, function (data) {
        ComplaintListServerActions.receivedData(data);
      });
    } else {
      ComplaintListServerActions.receivedData({'allegations':[], 'analytics': {}});
    }
  },

  getMoreData: function (pageNumber) {
    var queryString = AllegationFetcherQueryBuilder.buildQuery();
    var pagedQuery = [queryString, 'page=' + pageNumber, 'length=25'].join('&');

    if (queryString) {
      $.getJSON('/api/allegations/?' + pagedQuery, function (data) {
        ComplaintListServerActions.receivedMoreData(data);
      });
    }
  }
};

module.exports = ComplaintListAPI;
