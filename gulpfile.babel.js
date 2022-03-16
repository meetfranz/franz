/* eslint max-len: 0 */
import gulp from 'gulp';
import babel from 'gulp-babel';
import server from 'gulp-server-livereload';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import sassVariables from 'gulp-sass-variables';
import { removeSync } from 'fs-extra';
import kebabCase from 'kebab-case';
import hexRgb from 'hex-rgb';
import ts from 'gulp-typescript';
import terser from 'gulp-terser';

import config from './package.json';

import * as rawStyleConfig from './src/theme/default/legacy.js';

const tsProject = ts.createProject('./tsconfig.json');

const sass = require('gulp-sass')(require('sass'));

dotenv.config();

const styleConfig = Object.keys(rawStyleConfig).map((key) => {
  const isHex = /^#[0-9A-F]{6}$/i.test(rawStyleConfig[key]);
  return ({ [`$raw_${kebabCase(key)}`]: isHex ? hexRgb(rawStyleConfig[key], { format: 'array' }).splice(0, 3).join(',') : rawStyleConfig[key] });
});

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
    watch: [
      // 'packages/**/*.js',
      'src/**/*.js',
    ],
  },
  tsScripts: {
    src: 'src/**/*.ts',
    dest: 'build/',
    watch: [
      // 'packages/**/*.js',
      'src/**/*.ts',
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
      `!${paths.src}/**/*.ts`,
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

export function typescript() {
  return gulp.src(paths.tsScripts.src, { since: gulp.lastRun(typescript) })
    .pipe(tsProject())
    .pipe(gulp.dest(paths.tsScripts.dest));
}

export function scripts() {
  return gulp.src(paths.scripts.src, { since: gulp.lastRun(scripts) })
    .pipe(babel({
      comments: false,
    }))
    .pipe(gulp.dest(paths.scripts.dest));
}

export function minify() {
  return gulp.src(`${paths.dest}/**/*.js`)
    .pipe(terser())
    .pipe(gulp.dest(paths.dest));
}

export function watch() {
  gulp.watch(paths.packages.watch, mvLernaPackages);
  gulp.watch(paths.styles.watch, styles);

  gulp.watch([
    paths.src,
    `${paths.scripts.src}`,
    `${paths.scripts.src}`,
    `${paths.styles.src}`,
  ], mvSrc);

  gulp.watch(paths.scripts.watch, scripts);
  gulp.watch(paths.tsScripts.watch, typescript);
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
  gulp.parallel(typescript, mvSrc, mvPackageJson, mvLernaPackages),
  gulp.parallel(html, scripts, styles),
  minify,
);
export { build };

const devBuild = gulp.series(
  clean,
  gulp.parallel(typescript, mvSrc, mvPackageJson, mvLernaPackages),
  gulp.parallel(html, scripts, styles),
);

const dev = gulp.series(devBuild, gulp.parallel(webserver, watch));
export { dev };
