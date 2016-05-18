var RequestDocumentErrorPresenter = function (errors) {
  var errorMessage = function () {
    if ('email' in errors) {
      return 'Please provide a valid email address';
    }
    return 'An error has occurred while processing your request';
  };

  return {
    'errorMessage': errorMessage()
  };
};

module.exports = RequestDocumentErrorPresenter;
