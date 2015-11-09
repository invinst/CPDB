require('utils/jQuery');

var AppConstants = require('../constants/AppConstants');
var RaceGenderTabActions = require('actions/DataToolPage/RaceGenderTabActions');
var AllegationFetcherQueryBuilder = require('./AllegationFetcherQueryBuilder');

var ajax = null;

var RaceGenderAPI = {
  getData: function() {
    var queryString = AllegationFetcherQueryBuilder.buildQuery();

    if (ajax) {
      ajax.abort();
    };

    var queryString = AllegationFetcherQueryBuilder.buildQuery('all');
    var url  = AppConstants.RACE_GENDER_API_ENDPOINT + '?' + queryString;

    ajax = jQuery.getJSON(url, function(data){
      RaceGenderTabActions.receivedData(data);
    });
  }
};

module.exports = RaceGenderAPI;
