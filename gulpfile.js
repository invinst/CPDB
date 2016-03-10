var gulp = require('gulp');

var buildAllegationJSTask = require('./gulp_tasks/build_allegation_js');
var buildAllegationCSSTask = require('./gulp_tasks/build_allegation_sass');


gulp.task('build_allegation_js_minified', ['collectstatic'], buildAllegationJSTask(true));
gulp.task('build_allegation_js', buildAllegationJSTask(false));

gulp.task('build_allegation_sass', ['collectstatic'], buildAllegationCSSTask);
gulp.task('compile_allegation_sass', buildAllegationCSSTask);

gulp.task('collectstatic', require('./gulp_tasks/collectstatic'));

gulp.task('transform_allegation_template', ['collectstatic'], require('./gulp_tasks/transform_allegation_template'));

gulp.task('move_allegation_template', ['transform_allegation_template'],
  require('./gulp_tasks/move_allegation_template')
);

gulp.task('collect_common_template', ['collectstatic'], require('./gulp_tasks/collect_common_template'));

gulp.task('collect_bower_fonts', ['collectstatic'], require('./gulp_tasks/collect_bower_fonts'));

gulp.task('watch_allegation_js', require('./gulp_tasks/watch_allegation_js'));

gulp.task('build_allegation', [
  'build_allegation_sass', 'build_allegation_js_minified',
  'move_allegation_template', 'collect_common_template',
  'collect_bower_fonts'
]);

gulp.task('watch_allegation_sass', function () {
  gulp.watch('./common/static/sass/**/*', ['compile_allegation_sass']);
});

gulp.task('watch_allegation', ['watch_allegation_js', 'watch_allegation_sass']);
