const gulp = require('gulp');
const merge = require('lodash.merge');
const log = require('fancy-log');
const chalk = require('chalk');
const svgstore = require('gulp-svgstore');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const mergeStream = require('merge-stream');

const defaults = {
  src: {
    base: [
      './src/assets/media/svg/**/*.svg',
    ],
    demo: [
      './src/demo/modules/svgsprite/svg/*.svg',
    ],
  },
  srcBase: './src/',
  dest: './dist/assets/media/svg',
  watch: [
    './src/assets/media/svg/**/*.svg',
    './src/modules/**/svg/**/*.svg',
    './src/demo/modules/**/svg/**/*.svg',
  ],
  plugins: {},
  errorHandler: (err) => {
    log('estatico-svg-sprite', chalk.cyan(err.fileName), chalk.red(err.message));
  },
};

module.exports = (options) => {
  const config = merge({}, defaults, options);
  const names = Object.keys(config.src);
  const files = Object(config.src);
  const sprites = [];

  names.forEach((name) => {
    const sprite = gulp
      .src(files[names[name]])
      .pipe(imagemin({
        svgoPlugins: [
          {
            cleanupIDs: {
              remove: false,
            },
          },
          {
            cleanupNumericValues: {
              floatPrecision: 2,
            },
          },
          /* {
            removeAttrs: {
              attrs: ['fill']
            }
          }, */
          {
            removeStyleElement: true,
          },
          {
            removeTitle: true,
          },
        ],
        multipass: true,
      }))
      .pipe(svgstore({
        inlineSvg: true,
      }))
      .pipe(rename({
        basename: names[name],
      }))
      .pipe(gulp.dest(config.dest));

    sprites.push(sprite);
  });

  if (sprites.length > 0) {
    mergeStream(sprites);
  }

  return sprites;
};
