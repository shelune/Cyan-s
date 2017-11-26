let gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cssnano = require('gulp-cssnano'),
  sequence = require('run-sequence'),
  uglify = require('gulp-uglify'),
  pump = require('pump'),
  browserSync = require('browser-sync').create(),
  plumber = require('gulp-plumber'),
  del = require('del');

let paths = {
  srcHTML: 'src/**/*.html',
  srcStyle: 'src/styles/**/*.scss',
  srcJS: 'src/scripts/**/*.js',
  srcFonts: 'src/assets/fonts/*.{ttf,otf,woff,woff2,eot}',
  srcImages: 'src/assets/img/*.{png,jpg,gif}',
  distHTML: 'dist',
  distStyle: 'dist/styles',
  distJS: 'dist/scripts',
  distFonts: 'dist/assets/fonts',
  distImages: 'dist/assets',
}

gulp.task('html', function () {
  return gulp.src(paths.srcHTML)
    .pipe(gulp.dest(paths.distHTML))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('styles', function () {
  return gulp.src(paths.srcStyle)
    .pipe(plumber({
      handleError: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(sass())
    .pipe(autoprefixer({
      grid: true
    }))
    .pipe(cssnano())
    .pipe(gulp.dest(paths.distStyle))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('scripts', function () {
  pump([
    gulp.src(paths.srcJS),
    uglify(),
    gulp.dest(paths.distJS)
  ]);
});

gulp.task('fonts', function () {
  return gulp.src(paths.srcFonts)
    .pipe(gulp.dest(paths.distFonts));
});

gulp.task('images', function () {
  return gulp.src(paths.srcImages)
    .pipe(gulp.dest(paths.distImages));
})

gulp.task('watch:scripts', ['scripts'], function (cb) {
  browserSync.reload();
  cb();
});

gulp.task('watch:html', ['html'], function (cb) {
  browserSync.reload();
  cb();
});

gulp.task('clean:dist', function () {
  return del.sync('dist');
});

gulp.task('browserSync', function (){
  browserSync.init({
    server: {
      baseDir: './dist',
    },
    port: 4649,
    open: false
  })
});

gulp.task('watch', ['browserSync', 'styles', 'html', 'scripts', 'fonts', 'images'], function () {
  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch('src/scripts/**/*.js', ['watch:scripts']);
  gulp.watch('src/**/*.html', ['watch:html']);
  gulp.watch('src/assets/**/*.*', ['fonts', 'images']);
});

gulp.task('default', function (cb) {
  sequence('clean:dist', ['html', 'styles', 'scripts']);
});
