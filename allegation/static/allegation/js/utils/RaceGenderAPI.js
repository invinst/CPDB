require('utils/jQuery');

var AppConstants = require('../constants/AppConstants');
var RaceGenderTabActions = require('actions/DataToolPage/RaceGenderTabActions');
var AllegationFilterTagsQueryBuilder = require('utils/querybuilders/AllegationFilterTagsQueryBuilder');

var ajax = null;

var RaceGenderAPI = {
  getData: function() {
    var queryString = AllegationFilterTagsQueryBuilder.buildQuery();

    if (ajax) {
      ajax.abort();
    }

    var url = AppConstants.RACE_GENDER_API_ENDPOINT + '?' + queryString;

    ajax = jQuery.getJSON(url, function(data){
      RaceGenderTabActions.receivedData(data);
    });
  }
};

module.exports = RaceGenderAPI;
