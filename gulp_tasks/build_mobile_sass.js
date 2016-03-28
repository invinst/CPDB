var buildSass = require('./utils/build_sass');


module.exports = function (local, production) {
  return buildSass({
    src: './mobile/static/mobile/sass/style.sass',
    dest: local ? './local_static/css' : './static/css',
    fileName: 'mobile_style.css',
    production: production
  });
};
