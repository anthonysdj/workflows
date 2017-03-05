var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'), // includes SASS
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    jsonminify = require('gulp-jsonminify'),
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
        .pipe(gulpif(env === 'production', uglify()))
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
        .pipe(gulp.dest(outputDir))
        .pipe(connect.reload())
});

gulp.task('html', function() {
    gulp.src('builds/dev/*.html')
        .pipe(gulpif(env === 'production', minifyHTML()))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
        .pipe(connect.reload())
});

gulp.task('json', function() {
    gulp.src('builds/dev/js/*.json')
        .pipe(gulpif(env === 'production', jsonminify()))
        .pipe(gulpif(env === 'production', gulp.dest('builds/prod/js')))
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
    gulp.watch('builds/dev/*.html', ['html']);
    gulp.watch('builds/dev/js/*.json', ['json']);
});

gulp.task('default', ['coffee', 'js', 'compass', 'html', 'json', 'connect', 'watch'], function() {
    console.log( 'Running default task!' );
});