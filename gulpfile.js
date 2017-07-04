// +---------- install string -----------+
// install global gulp and browsersync
// npm i -g browser-sync
// npm i -g gulp
// npm i gulp gulp-rev-append gulp-rename gulp-autoprefixer gulp-less gulp-csscomb gulp-cssmin gulp-plumber gulp-notify browser-sync gulp-sourcemaps
// 1. main    | npm i gulp gulp-rev-append gulp-rename gulp-csscomb gulp-cssmin gulp-plumber gulp-notify browser-sync gulp-sourcemaps
// 2. less    | npm i gulp-autoprefixer gulp-less 
// 3. pug     | npm i gulp-pug
// 4. postcss | npm i gulp-postCss autoprefixer postcss-nested postcss-short postcss-assets
// +--------- required plugins ----------+
var gulp        = require('gulp');

// make revision or appending a query-string file hash
var rev         = require('gulp-rev-append');

// onErrors plugins
var plumber     = require('gulp-plumber');
var notify      = require('gulp-notify');

// browser sync
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

// sourcemaps
var sourcemaps  = require('gulp-sourcemaps');

// +--------------------------------------+
// css + less
var rename      = require("gulp-rename");
var prefix      = require('gulp-autoprefixer');
var less        = require('gulp-less');
var csscomb     = require('gulp-csscomb');
var cssmin      = require('gulp-cssmin');

// +--------------------------------------+
// pug
//var pug = require('gulp-pug');

// +--------------------------------------+
// postCss
var postcss       = require('gulp-postCss');
var autoprefixer  = require('autoprefixer');
var postCssNested = require('postcss-nested');
var postcssShort  = require('postcss-short');
var postcssAssets = require('postcss-assets');

// +-------------- tasks -----------------+ 
// + -------------------------------------+
// serve - main task
gulp.task('serve', ['cssmin'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("./css/less/*.less", ['cssmin']);
    //gulp.watch("./pug/*.pug", ['pug']);                       // compiled pug files
    //gulp.watch("./css/innercss/*.css", ['postcss']);          // compiled pug files
    gulp.watch("./*.html").on('change', browserSync.reload);    // reload for change .html files
    //gulp.watch(".js/*.js").on('change', browserSync.reload);  // reload for change .js files
});

// less
gulp.task('less', function(){
	return gulp.src('./css/less/styles.less')
			.pipe(plumber({
				errorHandler: notify.onError()
			}))
      //.pipe(sourcemaps.init())
      .pipe(less('./css/less/styles.less'))
      .pipe(prefix({browsers: ['last 5 version'], cascade: false}))
      .pipe(csscomb())
      //.pipe(sourcemaps.write())
      .pipe(gulp.dest('./css/'))
      .pipe(browserSync.stream());
});

// make styles.min.css
gulp.task('cssmin', ['less'], function(){
	return gulp.src('./css/styles.css')
		    .pipe(cssmin())
		    .pipe(rename({suffix: '.min'}))
		    .pipe(gulp.dest('./css/'))
	    	.pipe(browserSync.stream());
});

// compile pug
/*gulp.task('pug', function() {
  return gulp.src("./pug/*.pug")
      .pipe(pug({
          //basedir: __dirname,
          pretty: true
      }))
      .pipe(gulp.dest("./"))
      .pipe(browserSync.stream());
});*/

/*
gulp.task('postcss', function () {
    var plugins = [
        postCssNested,
        postcssShort,
        postcssAssets({
          loadPaths: ['src/assets/'],
          relativeTo: 'css/'
        }),
        autoprefixer({browsers: ['last 2 version']})
    ];
    return gulp.src('./css/innercss/styles.css')
        .pipe(postcss(plugins))
        .pipe(rename('styleOut.css'))
        .pipe(gulp.dest('./css/'));
        .pipe(browserSync.stream());
});
*/

gulp.task('default', ['serve']);
