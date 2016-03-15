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
  [/{% static '(search\/.*)' %}/g, 'search/static/$1'],
  [/{% static '(allegation\/.*)' %}/g, 'allegation/static/$1'],
  [/{% static '(icomoon\/.*)' %}/g, 'allegation/static/$1'],
  [/{% static '(graph\/.*)' %}/g, 'graph/static/$1'],
  [/{% static '(.*)' %}/g, 'bower_components/$1']
]);

module.exports = function () {
  return gulp.src(['./allegation/templates/allegation/base.html'])
    .pipe(replace(/<!-- build(?:.|\s)+?<!-- endbuild/g, replaceFunc))
    .pipe(useref({ searchPath: '.' }))
    .pipe(gulpif('base.html', source('base.html')
      .pipe(replace(/(<script src=")(js\/allegation_base_combined.js)/g, '$1{% static \'$2\' %}'))
    ))
    .pipe(gulpif('base.html', source('base.html')
      .pipe(replace(/(<link.+? href=")(css\/base_combined.css)/g, '$1{% static \'$2\' %}'))
    ))
    .pipe(gulpif('base.html', source('base.html')
      .pipe(gulp.dest('templates/allegation'))
    ))
    .pipe(ignore.exclude('base.html'))
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulp.dest('static'));
};
