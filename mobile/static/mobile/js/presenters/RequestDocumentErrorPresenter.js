var RequestDocumentErrorPresenter = function (errors) {
  var errorMessage = function () {
    if ('email' in errors) {
      return 'Please provide a valid email address.';
    }
    return 'An issue has occurred while processing your request.';
  };

  return {
    'errorMessage': errorMessage()
  };
};

module.exports = RequestDocumentErrorPresenter;
