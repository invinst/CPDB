var SharedExample = function () {
  var examples = {};

  var define = function (name, assertion) {
    if (!(name in examples)) {
      examples[name] = assertion;
    }
  };


  var get = function (name) {
    return examples[name];
  };

  return {
    'define': define,
    'get': get
  };
};

module.exports = SharedExample();
