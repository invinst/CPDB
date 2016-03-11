var buildJS = require('./utils/build_js');


module.exports = function (production) {
  return buildJS({
    production: production,
    nodePath: 'allegation/static/allegation/js',
    entries: './allegation/static/allegation/js/sunburst-app.js',
    bundleName: 'sunburst-bundle.js',
    dest: './static/allegation/js/'
  });
};
