var gulp = require('gulp');
var browserify = require('browserify');
var gutil = require('gulp-util');
var watchify = require('watchify');
var nodemon = require('gulp-nodemon');
var fs = require('fs');

var files = {
	js: {
    	src: './public/js/index.js',
    	dest: './public/js/build.js'
	}
};

gulp.task('js', function () {
	return browserify(files.js.src)
		.transform('babelify')
		.bundle()
		.pipe(fs.createWriteStream(files.js.dest));

});

gulp.task('js-watch', function () {
    var bundler = watchify(browserify(files.js.src, {debug: true}));

    bundler
    	.transform('babelify')
    bundler.on('update', rebundle);

    function onError(e) {
        gutil.log(gutil.colors.red(e.message));
    }

    function rebundle() {
        var start = Date.now();

        return bundler.bundle()
          .on('error', onError)
          .on('end', function () {
              var time = Date.now() - start;
              gutil.log('Building \'' + gutil.colors.green(files.js.src) + '\' in ' + gutil.colors.magenta(time + ' ms'));
          })
          .pipe(fs.createWriteStream(files.js.dest));
    }

    rebundle();
});

gulp.task('server', function () {
	nodemon({
		script: './server.es5.js',
		ext: 'js',
		watch: ['server.js', 'lib']
	});
});

gulp.task('dev', ['server', 'js-watch']);
