var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'), // includes SASS
    connect = require('gulp-connect'),
    concat = require('gulp-concat');

var coffeeSrcs = ['components/coffee/tagline.coffee'];
var jsSrcs = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];
var sassSrcs = ['components/sass/style.scss'];
var htmlSrcs = ['builds/dev/*.html'];
var jsonSrcs = ['builds/dev/js/*.json'];

gulp.task('coffee', function() {
    gulp.src(coffeeSrcs)
        .pipe(coffee({ bare: true })
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function() {
    gulp.src(jsSrcs)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(gulp.dest('builds/dev/js'))
        .pipe(connect.reload())
});

gulp.task('compass', function() {
    gulp.src(sassSrcs)
        .pipe(compass({
            css: 'builds/dev/css',
            sass: 'components/sass',
            image: 'builds/dev/images',
            style: 'expanded'
        })
            .on('error', gutil.log))
        // .pipe(gulp.dest('builds/dev/css'))
        .pipe(connect.reload())
});

gulp.task('html', function() {
    gulp.src(htmlSrcs)
        .pipe(connect.reload())
});

gulp.task('json', function() {
    gulp.src(jsonSrcs)
        .pipe(connect.reload())
});

gulp.task('connect', function() { // Start the server
    connect.server({
        root: 'builds/dev/',
        livereload: true
    });
});

gulp.task('watch', function() {
    gulp.watch(coffeeSrcs, ['coffee']);
    gulp.watch(jsSrcs, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch(htmlSrcs, ['html']);
    gulp.watch(jsonSrcs, ['json']);
});

gulp.task('default', ['coffee', 'js', 'compass', 'html', 'json', 'connect', 'watch'], function() {
    console.log( 'Running default task!' );
});