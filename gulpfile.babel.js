/* eslint max-len: 0 */
import gulp from 'gulp';
import babel from 'gulp-babel';
import sass from 'gulp-sass';
import server from 'gulp-server-livereload';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import sassVariables from 'gulp-sass-variables';
import { moveSync, removeSync } from 'fs-extra';
import kebabCase from 'kebab-case';
import hexRgb from 'hex-rgb';
import path from 'path';

import config from './package.json';

import * as rawStyleConfig from './src/theme/default/legacy.js';

dotenv.config();

const styleConfig = Object.keys(rawStyleConfig).map((key) => {
  const isHex = /^#[0-9A-F]{6}$/i.test(rawStyleConfig[key]);
  return ({ [`$raw_${kebabCase(key)}`]: isHex ? hexRgb(rawStyleConfig[key], { format: 'array' }).splice(0, 3).join(',') : rawStyleConfig[key] });
});

const paths = {
  src: 'src',
  dest: 'build',
  tmp: '.tmp',
  dictionaries: 'dictionaries',
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
    watch: [
      // 'packages/**/*.js',
      'src/**/*.js',
    ],
  },
  packages: {
    watch: 'packages/**/*',
    // dest: 'build/',
    // watch: [
    //   // 'packages/**/*.js',
    //   'src/**/*.js',
    // ],
  },
};

function _shell(cmd, cb) {
  console.log('executing', cmd);
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

const clean = (done) => {
  removeSync(paths.tmp);
  removeSync(paths.dest);

  done();
};
export { clean };

export function mvSrc() {
  return gulp.src(
    [
      `${paths.src}/*`,
      `${paths.src}/*/**`,
      `!${paths.scripts.watch[1]}`,
      `!${paths.src}/styles/**`,
      `!${paths.src}/**/*.js`,
    ], { since: gulp.lastRun(mvSrc) },
  )
    .pipe(gulp.dest(paths.dest));
}

export function mvPackageJson() {
  return gulp.src(
    [
      './package.json',
    ],
  )
    .pipe(gulp.dest(paths.dest));
}

export function mvLernaPackages() {
  return gulp.src(
    [
      'packages/**',
    ],
  )
    .pipe(gulp.dest(`${paths.dest}/packages`));
}

export function html() {
  return gulp.src(paths.html.src, { since: gulp.lastRun(html) })
    .pipe(gulp.dest(paths.html.dest));
}

export function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sassVariables(Object.assign({
      $env: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    }, ...styleConfig)))
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
  gulp.watch(paths.packages.watch, mvLernaPackages);
  gulp.watch(paths.styles.watch, styles);

  gulp.watch([
    paths.src,
    `${paths.scripts.src}`,
    `${paths.styles.src}`,
  ], mvSrc);

  gulp.watch(paths.scripts.watch, scripts);
}

export function webserver() {
  gulp.src([
    paths.dest,
  ])
    .pipe(server({
      livereload: true,
    }));
}

export function dictionaries(done) {
  const { SPELLCHECKER_LOCALES } = require('./build/i18n/languages');

  let packages = '';
  Object.keys(SPELLCHECKER_LOCALES).forEach((key) => { packages = `${packages} hunspell-dict-${key}`; });

  _shell(`npm install --prefix ${path.join(__dirname, 'temp')} ${packages}`, () => {
    moveSync(
      path.join(__dirname, 'temp', 'node_modules'),
      path.join(__dirname, 'build', paths.dictionaries),
    );

    removeSync(path.join(__dirname, 'temp'));

    done();
  });
}

export function sign(done) {
  _shell(`codesign --verbose=4 --deep --strict --force --sign "${process.env.SIGNING_IDENTITY}" "${__dirname}/node_modules/electron/dist/Electron.app"`, done);
}

const build = gulp.series(
  clean,
  gulp.parallel(mvSrc, mvPackageJson, mvLernaPackages),
  gulp.parallel(html, scripts, styles),
  dictionaries,
);
export { build };

const dev = gulp.series(build, gulp.parallel(webserver, watch));
export { dev };
