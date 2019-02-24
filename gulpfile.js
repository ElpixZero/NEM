/* eslint-disable node/no-unpublished-require*/

const gulp = require('gulp'); //ИНН + ЗАЧЕТКА + ПАСПОРТ С ПРОПИСКОЙ + ДОГОВОР С ОБЩАГИ (ЗАВЕРЕННЫЙ) + ЗАЯВЛЕНИЕ.
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');

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

function watch() {
  gulp.watch('./dev/scss/**/*.scss', scss);
}


gulp.task('scss', scss);
gulp.task('watch', watch);

gulp.task('default', gulp.series('scss', 'watch' ));



