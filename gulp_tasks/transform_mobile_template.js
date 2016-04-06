var gulp = require('gulp');
var gulpif = require('gulp-if');
var source = require('vinyl-source-stream');
var ignore = require('gulp-ignore');
var minifyCss = require('gulp-minify-css');
var revReplace = require('gulp-rev-replace');


module.exports = function () {
  var jsManifest = gulp.src('./static/mobile/js/rev-manifest.json');
  var cssManifest = gulp.src('./static/css/rev-manifest.json');

  return gulp.src(['./mobile/templates/mobile/index.html'])
    .pipe(gulpif('index.html', source('index.html')
      .pipe(revReplace({manifest: jsManifest}))
    ))
    .pipe(gulpif('index.html', source('index.html')
      .pipe(revReplace({manifest: cssManifest}))
    ))
    .pipe(gulpif('index.html', source('index.html')
      .pipe(gulp.dest('templates/mobile'))
    ))
    .pipe(ignore.exclude('index.html'))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulp.dest('static'));
};
