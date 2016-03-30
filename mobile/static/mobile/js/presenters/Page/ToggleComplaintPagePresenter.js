var u = require('utils/HelperUtil');
var CollectionUtil = require('utils/CollectionUtil');


var ToggleComplaintPagePresenter = function (officerAllegations) {
  var officerAllegations = officerAllegations || [];

  var groupByCategory = function () {
    return CollectionUtil.groupBy(officerAllegations, function (officerAllegation) {
      return u.fetch(officerAllegation, 'cat.id', 0);
    });
  };

  return {
    groupByCategory: groupByCategory()
  };
};


module.exports = ToggleComplaintPagePresenter;
