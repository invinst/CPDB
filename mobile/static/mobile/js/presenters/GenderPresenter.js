var GenderPresenter = function (gender) {
  var humanReadable = function () {
    if (gender == 'M') return 'Male';
    if (gender == 'F') return 'Female';
    if (gender == 'X') return 'X';
    return 'Gender unknown';
  };

  return {
    'humanReadable': humanReadable()
  };
};

module.exports = GenderPresenter;
