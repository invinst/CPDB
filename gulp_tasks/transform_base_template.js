var gulp = require('gulp');
var replace = require('gulp-replace');
var gulpif = require('gulp-if');
var source = require('vinyl-source-stream');
var useref = require('gulp-useref');
var ignore = require('gulp-ignore');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var replaceStaticTagWithRealPath = require('./utils/replace_static_tag_with_real_path');


var replaceFunc = replaceStaticTagWithRealPath([
  [/{% static '(js\/.*)' %}/g, 'common/static/$1'],
  [/{% static '(.*)' %}/g, 'bower_components/$1']
]);

module.exports = function () {
  return gulp.src(['./common/templates/base.html'])
    .pipe(replace(/<!-- build(?:.|\s)+?<!-- endbuild/g, replaceFunc))
    .pipe(useref({ searchPath: '.' }))
    .pipe(gulpif('base.html', source('base.html')
      .pipe(replace(/(<script src=")(js\/combined.js)/g, '$1{% static \'$2\' %}'))
    ))
    .pipe(gulpif('base.html', source('base.html')
      .pipe(gulp.dest('templates'))
    ))
    .pipe(ignore.exclude('base.html'))
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulp.dest('static'));
};
