var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var rev = require('gulp-rev');
var gulpif = require('gulp-if');


module.exports = function (options) {
  return function () {
    return gulp.src(options.src)
      .pipe(sass({
        indentedSyntax: true
      }).on('error', sass.logError))
      .pipe(rename(options.fileName))
      .pipe(gulpif(options.production, rev()))
      .pipe(gulp.dest(options.dest))
      .pipe(gulpif(options.production, rev.manifest(options.dest + '/rev-manifest.json', {
        base: options.dest,
        merge: true
      })))
      .pipe(gulpif(options.production, gulp.dest(options.dest)));
  };
};
