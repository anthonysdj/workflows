var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'), // includes SASS
    connect = require('gulp-connect'),
    concat = require('gulp-concat');

var env,
    coffeeSrcs,
    jsSrcs,
    sassSrcs,
    htmlSrcs,
    jsonSrcs,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    outputDir = 'builds/dev/';
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/prod/';
    sassStyle = 'compressed';
}

coffeeSrcs = ['components/coffee/tagline.coffee'];
jsSrcs = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];
sassSrcs = ['components/sass/style.scss'];
htmlSrcs = [outputDir + '*.html'];
jsonSrcs = [outputDir + 'js/*.json'];

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
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload())
});

gulp.task('compass', function() {
    gulp.src(sassSrcs)
        .pipe(compass({
            style: sassStyle,
            css: outputDir + 'css',
            sass: 'components/sass',
            image: outputDir + 'images'
        })
            .on('error', gutil.log))
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
        root: outputDir,
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