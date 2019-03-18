/* eslint-disable node/no-unpublished-require*/

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

function scss() {
   return gulp
  .src('dev/scss/**/*.scss')
  .pipe(sass())
  .pipe(
    autoprefixer(['last 15 versions','> 1%','ie 8','ie 7'], {
      cascade: true
    })
  )
  .pipe(cssnano()) //сжимает css
  .pipe(gulp.dest('./public/stylesheets'));
};

function scripts() {
  return gulp
  .src(['dev/js/auth.js',
       'dev/js/post.js',
       'dev/js/comment.js',
  ])
  .pipe(concat('scripts.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./public/javascripts'));
}

function watch() {
  gulp.watch('./dev/scss/**/*.scss', scss);
  gulp.watch('./dev/js/**/*.js', scripts);
}

gulp.task('scss', scss);
gulp.task('scripts', scripts);
gulp.task('watch', watch);

gulp.task('default', gulp.series(
  gulp.parallel('scss', 'scripts'), 
  'watch' )
);



