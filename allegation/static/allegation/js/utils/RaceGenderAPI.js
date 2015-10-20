global.jQuery = require('jquery');

var AppConstants = require('../constants/AppConstants');
var AllegationFetcherQueryBuilder = require('utils/AllegationFetcherQueryBuilder');
var RaceGenderTabActions = require('actions/DataToolPage/RaceGenderTabActions');

var ajax = null;

var RaceGenderAPI = {
  getData: function() {
    if (ajax) {
      ajax.abort();
    };

    var queryString = AllegationFetcherQueryBuilder.buildQuery();
    var url  = AppConstants.RACE_GENDER_API_ENDPOINT + queryString;

    ajax = $.getJSON(url, function(data){
      RaceGenderTabActions.receivedData(data);
    });
  }
};

module.exports = RaceGenderAPI;
