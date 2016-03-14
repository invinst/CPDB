var buildSass = require('./utils/build_sass');


module.exports = function (production) {
  return buildSass({
    src: './mobile/static/mobile/sass/style.sass',
    dest: production ? './static/css' : './local_static/css',
    fileName: 'mobile_style.css'
  });
};
