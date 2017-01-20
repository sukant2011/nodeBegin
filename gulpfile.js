var browserify = require('browserify');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var nodemon = require('gulp-nodemon');
var htmlmin = require('gulp-htmlmin');
var minify = require('gulp-minify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

gulp.task('browserify', function() {
     // Grabs the app.js file
     return browserify('./angular/app.js')
     // bundles it and creates a file called main.js
     .bundle()
     .pipe(source('front.js'))
     // saves it the public/js/ directory
     .pipe(gulp.dest('./public/javascripts/front/'));
});

// gulp.task('browserify', function() {
//   return browserify('./angular/app.js')
//     .bundle()
//     .pipe(source('front.js')) // gives streaming vinyl file object
//     .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
//     .pipe(uglify()) // now gulp-uglify works
//     .pipe(gulp.dest('./public/javascripts/'));
// });


gulp.task('MinifyWebJS', function() {
    return gulp.src('./public/javascripts/front/angularjs/*.js')
        .pipe(concat('webMin.js'))
        .pipe(gulp.dest('./public/javascripts/front/'))
        .pipe(rename('webMin.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/javascripts/front/'));
});

gulp.task('watch', function() {
     gulp.watch('angular/**/*.js', ['browserify'])
});

gulp.task('start', function () {
     nodemon({
          script: 'bin/www'
          //  , ext: 'js html'
          , env: { 'NODE_ENV': 'local' }
     })
})

// gulp.task('minifyHtml', function() {
//   return gulp.src('./public/templates/front/*.html')
//     .pipe(htmlmin({collapseWhitespace: true}))
//     .pipe(gulp.dest('./public/'));
// });

gulp.task('default', ['start','browserify', 'watch'])
//gulp.task('default', ['browserify'])
