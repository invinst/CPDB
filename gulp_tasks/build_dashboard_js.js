var buildJS = require('./utils/build_js');


module.exports = function (production) {
  return buildJS({
    production: production,
    nodePath: 'dashboard/static/dashboard/js',
    entries: './dashboard/static/dashboard/js/app.js',
    bundleName: 'bundle.js',
    dest: './static/dashboard/js/'
  });
};
