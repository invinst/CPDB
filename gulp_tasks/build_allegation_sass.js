var gulp = require('gulp');
var sass = require('gulp-sass');


module.exports = function () {
  return gulp.src(['./common/static/sass/style.sass', './common/static/sass/test.sass'])
    .pipe(sass({
      indentedSyntax: true
    }).on('error', sass.logError))
    .pipe(gulp.dest('./static/css'));
};
