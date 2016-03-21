var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');


module.exports = function (options) {
  return function () {
    return gulp.src(options.src)
      .pipe(sass({
        indentedSyntax: true
      }).on('error', sass.logError))
      .pipe(rename(options.fileName))
      .pipe(gulp.dest(options.dest));
  };
};
