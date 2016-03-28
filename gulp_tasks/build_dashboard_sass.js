var buildSass = require('./utils/build_sass');


module.exports = function (local, production) {
  return buildSass({
    src: './dashboard/static/dashboard/sass/style.sass',
    dest: local ? './local_static/css' : './static/css',
    fileName: 'dashboard_style.css',
    production: production
  });
};
