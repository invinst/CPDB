var buildJS = require('./utils/build_js');


module.exports = function (production) {
  return buildJS({
    production: production,
    nodePath: 'mobile/static/mobile/js',
    entries: './mobile/static/mobile/js/app.js',
    bundleName: 'bundle.js',
    dest: production ? './static/mobile/js/' : './local_static/mobile/js/'
  });
};
