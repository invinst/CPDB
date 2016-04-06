var buildSass = require('./utils/build_sass');


module.exports = function (local) {
  return buildSass({
    src: './common/static/sass/test.sass',
    dest: local ? './local_static/css' : './static/css',
    fileName: 'test.css'
  });
};
