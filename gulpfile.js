"use strict";

const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const uglify = require("gulp-uglify");

function css(cb) {
  gulp
    .src([
      "./static/css/application.css",
      "./static/css/code_theme.css"
    ])
    .pipe(concat("styles.min.css"))
    .pipe(autoprefixer())
    .pipe(
      cleanCSS(
        {
          debug: true,
          level: 2
        },
        details => {
          console.log(`${details.name}: ${details.stats.originalSize}`);
          console.log(`${details.name}: ${details.stats.minifiedSize}`);
        }
      )
    )
    .pipe(gulp.dest("./static"));
  cb();
}

function js(cb) {
  gulp
    .src([
      "./static/js/application.js",
      "./static/js/scripts.js"
    ])
    .pipe(concat("scripts.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./static"));
  cb();
}

function jp(cb) {
  gulp
    .src([
      "./jp/adj_i.txt",
      "./jp/adj_na.txt"
    ])
    .pipe(concat("adj.txt", {
      newLine: ''
    }))
    .pipe(gulp.dest("./jp"))
  cb();
}

function clean(cb) {
  del([
    "./static/scripts.min.js",
    "./static/styles.min.css",
    "./jp/adj.txt"
  ]);
  cb();
}

exports = Object.assign(exports, {
  css,
  js,
  jp,
  clean,
  default: gulp.series(clean, gulp.parallel(css, js, jp))
});
