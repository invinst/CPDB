var gutil = require('gulp-util');
var exec = require('child_process').exec;


module.exports = function (dir) {
  return function (cb) {
    exec('mkdir ' + dir, function (err, stdout, stderr) {
      gutil.log(stdout);
      gutil.log(stderr);
      cb();
    });
  };
};
