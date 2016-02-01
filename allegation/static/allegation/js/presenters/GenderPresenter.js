var GenderMap = {
  'F':'Female',
  'M':'Male',
  'X':'Trans'
};

var GenderPresenter = function (gender) {
  return GenderMap[gender] || '';
};

module.exports = GenderPresenter;
