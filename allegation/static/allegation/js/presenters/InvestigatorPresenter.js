var AppConstants = require('../constants/AppConstants');


var InvestigatorPresenter = function (investigator) {

  var unitName = function() {
    return AppConstants.UNITS[investigator.current_unit] || 'Unknown unit';
  };

  return {
    name: (investigator.name || '').toUpperCase(),
    rank: AppConstants.RANKS[investigator.current_rank] || 'N/A',
    unitWithName: investigator.current_unit ? investigator.current_unit + ' / ' + unitName() : 'Unknown unit'
  };
};

module.exports = InvestigatorPresenter;
