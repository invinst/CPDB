var gutil = require('gulp-util');
var exec = require('child_process').exec;


module.exports = function (cb) {
  exec('python manage.py collectstatic -c --noinput', {maxBuffer: 1024 * 500}, function (err, stdout, stderr) {
    gutil.log(stdout);
    gutil.log(stderr);
    cb(err);
  });
};
