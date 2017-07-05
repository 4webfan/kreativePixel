// +---------- install string -----------+
// install global gulp and browsersync
// npm i -g browser-sync
// npm i -g gulp
// npm i gulp gulp-rev-append gulp-rename gulp-autoprefixer gulp-less gulp-csscomb gulp-cssmin gulp-plumber gulp-notify browser-sync gulp-sourcemaps
// 1. main    | npm i gulp gulp-rev-append gulp-rename gulp-csscomb gulp-cssmin gulp-plumber gulp-notify browser-sync gulp-sourcemaps --save-dev
// 2. less    | npm i gulp-autoprefixer gulp-less --save-dev
// 3. pug     | npm i gulp-pug gulp-html-beautify --save-dev
// 4. postcss | npm i gulp-postCss autoprefixer postcss-nested postcss-short postcss-assets gulp-concat --save-dev
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

// concat
var concat = require('gulp-concat');

// +--------------------------------------+
// css + less
var rename      = require("gulp-rename");
var csscomb     = require('gulp-csscomb');
var cssmin      = require('gulp-cssmin');

// +--------------------------------------+
// pug
var pug = require('gulp-pug');
var htmlbeautify = require('gulp-html-beautify');

// +--------------------------------------+
// postCss
var postcss       = require('gulp-postCss');
var autoprefixer  = require('autoprefixer');
var postCssNested = require('postcss-nested');
var postcssShort  = require('postcss-short');

// +-------------- tasks -----------------+ 
// + -------------------------------------+
// serve - main task
gulp.task('serve', function() {

    browserSync.init({
        server: "./"
    });

    //gulp.watch("./css/less/*.less", ['cssmin']);
    gulp.watch("./pug/**/*.pug", ['pug']);                      // compiled pug files
    gulp.watch("./css/in/**/*.css", ['postcss']);               // compiled pug files
    gulp.watch("./css/out/styles.css", ['cssmin']);             // minified outer css
    gulp.watch("./*.html").on('change', browserSync.reload);    // reload for change .html files
    //gulp.watch(".js/*.js").on('change', browserSync.reload);  // reload for change .js files
    gulp.watch("./*.html", ['htmlbeautify']);                   // Formatting html files (after compile any pug files)
});

// less
/*gulp.task('less', function(){
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
});*/

// make styles.min.css
gulp.task('cssmin', function(){
	return gulp.src('./css/out/styles.css')
		    .pipe(cssmin())
		    .pipe(rename({suffix: '.min'}))
		    .pipe(gulp.dest('./css/out'))
	    	.pipe(browserSync.stream());
});

// compile pug
gulp.task('pug', function() {
  return gulp.src("./pug/pages/*.pug")
      .pipe(pug({
          //basedir: __dirname,
          //pretty: '  '
      }))
      .pipe(gulp.dest("./"))
      .pipe(htmlbeautify())
      .pipe(browserSync.stream());
});

// postcss
gulp.task('postcss', ['cssconcat'], function () {
    var plugins = [
        postCssNested,
        postcssShort,
        autoprefixer({browsers: ['last 2 version']})
    ];
    return gulp.src('./css/in/styles.css')
        .pipe(postcss(plugins))
        .pipe(csscomb())
        .pipe(gulp.dest('./css/out'))
        .pipe(browserSync.stream());
});

// css concat
gulp.task('cssconcat', function() {
    return gulp.src(['./css/in/parts/fonts.css', './css/in/parts/normalize.css', './css/in/parts/icons.css', './css/in/parts/styles.css', './css/in/parts/plugins.css', './css/in/parts/media.css'])
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('./css/in'));
});

// formatted html files
gulp.task('htmlbeautify', function() {
    var options = {
        indentSize: 2
    };
gulp.src('./*.html')
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest('./'))
});

// default
gulp.task('default', ['serve']);
