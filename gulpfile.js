'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
//var reactify = require('reactify');
var source = require('vinyl-source-stream');
var eslint = require('gulp-eslint');

gulp.task('lint', function () {
  return gulp.src(['./frontend/js/app/**/*.jsx', './frontend/js/app/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('jsx', function () {
  return browserify({
    entries: './frontend/js/app/app.js',
    extensions: ['.js', '.jsx'],
    debug: true
  })
    .transform(babelify.configure({
      presets: ['es2015', 'react']
    }))
    .bundle()
    .on('error', function (err) {
      // print the error (can replace with gulp-util)
      console.log(err.message);
      // end this stream
      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./frontend/js'));
});

gulp.task('build', ['jsx']);

gulp.task('watch', ['build'], function () {
  gulp.watch('./frontend/js/app/**/*', ['build']);
});

var jshint = require('gulp-jshint');
gulp.task('jshint', function () {
  return gulp.src(['gulpfile.js', 'backend/config/*.js', 'backend/config/**/*.js', 'backend/hooks/*.js', 'backend/models/*.js',
    'backend/routes/*.js', 'backend/routes/**/*.js', 'backend/lib/*.js', 'backend/lib/**/*.js', 'backend/*.js',
    'backend/services/*.js', 'backend/controllers/*.js'])
    //.pipe(jshint())
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish', {verbose: true})).on('error', function (error) {
      console.error(String(error));
    });
});

gulp.task('default', ['watch']);
