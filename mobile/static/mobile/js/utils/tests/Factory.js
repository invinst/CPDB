var Factory = function () {
  var schemas = {};
  var sequences = {};

  var sequence = function (key) {
    if (key in sequences) {
      sequences[key] = sequences[key] + 1;
    } else {
      sequences[key] = 1;
    }

    return sequences[key];
  };

  var create = function (name, override) {
    var obj = {};
    var key = '';
    var schema = schemas[name];

    for (key in schema) {
      if (override && key in override) {
        obj[key] = override[key];
      } else {
        obj[key] = schema[key]();
      }
    }

    return obj;
  };

  var createBatch = function (numberOfObjects, name, override) {
    var i = 0;
    var results = [];

    for (i = 0; i < numberOfObjects; i++) {
      results.push(create(name, override));
    }

    return results;
  };

  var define = function (name, schema) {
    schemas[name] = schema;
  };

  var getSchemas = function () {
    return Object.keys(schemas);
  };

  return {
    create: create,
    createBatch: createBatch,
    define: define,
    sequence: sequence,
    getSchemas: getSchemas
  };
};

module.exports = Factory;
