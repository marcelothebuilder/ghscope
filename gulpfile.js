const gulp = require('gulp');
const usemin = require('gulp-usemin');
const uglify = require('gulp-uglify');
const minifyCss = require('gulp-minify-css');
const minifyHtml = require('gulp-minify-html');

gulp.task('build:dist', () => {
    gulp.src('./src/**/*.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            jsapp: ['concat'],
            jslib: ['concat'],
            html: [function () {return minifyHtml({ empty: true });} ]
        }))
        .pipe(gulp.dest('./dist/'));
});
