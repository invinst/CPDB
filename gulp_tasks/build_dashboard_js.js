var buildJS = require('./utils/build_js');


module.exports = function (production) {
  return buildJS({
    production: production,
    nodePath: 'dashboard/static/dashboard/js',
    entries: './dashboard/static/dashboard/js/app.js',
    bundleName: 'bundle.js',
    dest: production ? './static/dashboard/js/' : './local_static/dashboard/js/'
  });
};
