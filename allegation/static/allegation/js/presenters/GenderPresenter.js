var GenderMap = {
  'F':'Female',
  'M':'Male',
  'X':'X'
};

var GenderPresenter = function (gender) {
  return GenderMap[gender] || '';
};

module.exports = GenderPresenter;
