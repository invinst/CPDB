var gulp = require('gulp');
var replace = require('gulp-replace');
var gulpif = require('gulp-if');
var source = require('vinyl-source-stream');
var useref = require('gulp-useref');
var ignore = require('gulp-ignore');
var minifyCss = require('gulp-minify-css');
var replaceStaticTagWithRealPath = require('./utils/replace_static_tag_with_real_path');


var replaceFunc = replaceStaticTagWithRealPath([
  [/{% static '(css\/.*)' %}/g, 'static/$1'],
  [/{% static '(.*)' %}/g, 'bower_components/$1']
]);

module.exports = function () {
  return gulp.src(['./dashboard/templates/dashboard/index.html'])
    .pipe(replace(/<!-- build(?:.|\s)+?<!-- endbuild/g, replaceFunc))
    .pipe(useref({ searchPath: '.' }))
    .pipe(gulpif('index.html', source('index.html')
      .pipe(replace(/(<link.+? href=")(css\/dashboard_combined.css)/g, '$1{% static \'$2\' %}'))
    ))
    .pipe(gulpif('index.html', source('index.html')
      .pipe(gulp.dest('templates/dashboard'))
    ))
    .pipe(ignore.exclude('index.html'))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulp.dest('static'));
};
