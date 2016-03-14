var buildSass = require('./utils/build_sass');


module.exports = function (production) {
  return buildSass({
    src: './common/static/sass/style.sass',
    dest: production ? './static/css' : './local_static/css',
    fileName: 'style.css'
  });
};
