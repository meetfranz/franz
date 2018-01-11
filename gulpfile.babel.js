/* eslint max-len: 0 */
import gulp from 'gulp';
import babel from 'gulp-babel';
import sass from 'gulp-sass';
import server from 'gulp-server-livereload';
import del from 'del';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import sassVariables from 'gulp-sass-variables';

import config from './package.json';

dotenv.config();

const paths = {
  src: 'src',
  dest: 'build',
  tmp: '.tmp',
  package: `out/${config.version}`,
  html: {
    src: 'src/**/*.html',
    dest: 'build/',
    watch: 'src/**/*.html',
  },
  styles: {
    src: 'src/styles/main.scss',
    dest: 'build/styles',
    watch: 'src/styles/**/*.scss',
  },
  scripts: {
    src: 'src/**/*.js',
    dest: 'build/',
    watch: 'src/**/*.js',
  },
};

function _shell(cmd, cb) {
  exec(cmd, {
    cwd: paths.dest,
  }, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);

    cb();
  });
}

const clean = () => del([paths.tmp, paths.dest]);
export { clean };

export function mvSrc() {
  return gulp.src(
    [
      `${paths.src}/*`,
      `${paths.src}/*/**`,
      `!${paths.scripts.watch}`,
      `!${paths.src}/styles/**`,
    ], { since: gulp.lastRun(mvSrc) })
    .pipe(gulp.dest(paths.dest));
}

export function mvPackageJson() {
  return gulp.src(
    [
      './package.json',
    ])
    .pipe(gulp.dest(paths.dest));
}

export function html() {
  return gulp.src(paths.html.src, { since: gulp.lastRun(html) })
    .pipe(gulp.dest(paths.html.dest));
}

export function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sassVariables({
      $env: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    }))
    .pipe(sass({
      includePaths: [
        './node_modules',
        '../node_modules',
      ],
    }).on('error', sass.logError))
    .pipe(gulp.dest(paths.styles.dest));
}

export function scripts() {
  return gulp.src(paths.scripts.src, { since: gulp.lastRun(scripts) })
    .pipe(babel({
      comments: false,
    }))
    .pipe(gulp.dest(paths.scripts.dest));
}

export function watch() {
  gulp.watch(paths.scripts.watch, scripts);
  gulp.watch(paths.styles.watch, styles);

  gulp.watch([
    paths.src,
    `${paths.scripts.src}`,
    `${paths.styles.src}`,
  ], mvSrc);
}

export function webserver() {
  gulp.src([
    paths.dest,
  ])
    .pipe(server({
      livereload: true,
    }));
}

export function sign(done) {
  _shell(`codesign --verbose=4 --deep --strict --force --sign "${process.env.SIGNING_IDENTITY}" "${__dirname}/node_modules/electron/dist/Electron.app"`, done);
}

const build = gulp.series(
  clean,
  gulp.parallel(mvSrc, mvPackageJson),
  gulp.parallel(html, scripts, styles),
);
export { build };

const dev = gulp.series(build, gulp.parallel(webserver, watch));
export { dev };
