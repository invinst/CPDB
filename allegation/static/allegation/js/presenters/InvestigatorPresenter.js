var AppConstants = require('../constants/AppConstants');


var InvestigatorPresenter = function (investigator) {

  var unitName = function () {
    return AppConstants.UNITS[investigator.unit] || 'Unknown unit';
  };

  return {
    name: (investigator.name || '').toUpperCase(),
    rank: investigator.current_rank || 'N/A',
    unitWithName: investigator.unit ? unitName() : 'Unknown unit'
  };
};

module.exports = InvestigatorPresenter;
