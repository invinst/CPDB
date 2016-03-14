var buildSass = require('./utils/build_sass');


module.exports = function (production) {
  return buildSass({
    src: './dashboard/static/dashboard/sass/style.sass',
    dest: production ? './static/css' : './local_static/css',
    fileName: 'dashboard_style.css'
  });
};
