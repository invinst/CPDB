var buildSass = require('./utils/build_sass');


module.exports = function (local, production) {
  return buildSass({
    src: './common/static/sass/style.sass',
    dest: local ? './local_static/css' : './static/css',
    fileName: 'style.css',
    production: production
  });
};
