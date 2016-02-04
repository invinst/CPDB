var GenderMap = {
  'F':'Female',
  'M':'Male',
  'X':'X'
};

var GenderPresenter = function (gender) {
  return gender && GenderMap[gender.toUpperCase()] || 'N/A';
};

module.exports = GenderPresenter;
