const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass");
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify");
const minify = require("gulp-minify");
const babel = require("gulp-babel");
const browsersync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const cache = require("gulp-cache");
const plumber = require("gulp-plumber");

/* Options
 * ------ */
const options = {
  pug: {
    src: ["src/**/*.pug", "src/**/*.html"],
    dest: ["dist"]
  },
  scripts: {
    src: ["src/js/*.js", "src/js/**/*.js"],
    dest: "dist/library/js"
  },
  styles: {
    src: ["src/scss/*.scss", "src/scss/**/*.scss"],
    dest: ["dist/library/css"]
  },
  images: {
    src: ["src/img/*.+(png|jpeg|jpg|gif|svg)", "src/img/**/*.+(png|jpeg|jpg|gif|svg)"],
  	dest: ["dist/library/img"]
  },
  fonts: {
    src: ["src/fonts/*.+(woff|woff2)"],
  	dest: "dist/library/fonts"
  },
  library: {
    src: ["src/lib/**/*"],
    dest: "dist/library/"
  },
  favicon: {
    src: ["src/*.ico"],
    dest: "dist/"
  },
    index: {
        src: ["src/index.html"],
        dest: "dist/"
    },
    blog: {
      src: ["src/blog.html"],
      dest: "dist/"
    },
    work: {
      src: ["src/work.html"],
      dest: "dist/"
    },
    detail: {
      src: ["src/detail.html"],
      dest: "dist/"
    },
  browserSync: {
    baseDir: "dist"
  }
};

/* Browser-sync
 * ------------ */
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: options.browserSync.baseDir
    },
    port: 4000
  });
  done();
}

/* Styles
 * ------ */

function styles() {
  return gulp
    .src(options.styles.src)
    .pipe(
      plumber(function(err) {
        console.error("Styles Task Error", err);
        this.emit("end");
      })
    )
    .pipe(
      sass({
        outputStyle: 'expanded',
        indentType: 'space',
        indentWidth: '2'
      }).on("error", sass.logError)
     )
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false,
        grid: true
      })
    )
    .pipe(minify())
    .pipe(gulp.dest(options.styles.dest))
    // .pipe(
    //   browsersync.reload({
    //     stream: true
    //   })
    // );
}

/* Scripts
 * ------ */

function scripts() {
  return gulp
    .src(options.scripts.src)
    .pipe(minify({
      ext:{
          min:'.js'
      },
      noSource: true
    }))
    .pipe(
      plumber(function(err) {
        console.error("Scripts Task Error", err);
        this.emit("end");
      })
    )
    .pipe(babel())
    .pipe(
      uglify({
        output: {
          beautify: true,
          comments: true,
          indent_level: 2
        }
      })
     )
    .pipe(gulp.dest(options.scripts.dest))
    // .pipe(
    //   browsersync.reload({
    //     stream: true
    //   })
    // );
}
/* Views
 * ------ */

function views() {
  return gulp
    .src(options.pug.src)
    .pipe(
      plumber(function(err) {
        console.error("Pug Task Error", err);
        this.emit("end");
      })
    )
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(options.pug.dest))
    // .pipe(
    //   browsersync.reload({
    //     stream: true
    //   })
    // );
}


// /* Images
//  * ------ */

function images() {
  return gulp
    .src(options.images.src)
    .pipe(
      cache(
        imagemin({
          interlaced: true
        })
      )
    )
    .pipe(gulp.dest(options.images.dest));
}

// /* Libs
//  * ------ */

function library() {
  return gulp
    .src(options.library.src)
    .pipe(gulp.dest(options.library.dest));
}

function index() {
    return gulp
        .src(options.index.src)
        .pipe(gulp.dest(options.index.dest));
}

function blog() {
  return gulp
      .src(options.blog.src)
      .pipe(gulp.dest(options.blog.dest));
}

function work() {
  return gulp
      .src(options.work.src)
      .pipe(gulp.dest(options.work.dest));
}

function detail() {
  return gulp
      .src(options.detail.src)
      .pipe(gulp.dest(options.detail.dest));
}

function fonts() {
  return gulp
    .src(options.fonts.src)
    .pipe(gulp.dest(options.fonts.dest));
}

// favicon
function favicon() {
  return gulp
    .src(options.favicon.src)
    .pipe(gulp.dest(options.favicon.dest));
}


function watchFiles() {
  gulp.watch(options.pug.src, views);
  gulp.watch(options.styles.src, styles);
  gulp.watch(options.scripts.src, scripts);
  gulp.watch(options.images.src, images);
  gulp.watch(options.library.src, library);
  gulp.watch(options.favicon.src, favicon);
  gulp.watch(options.fonts.src, fonts);
  gulp.watch(options.index.src, index);
  gulp.watch(options.index.src, blog);
  gulp.watch(options.index.src, work);
  gulp.watch(options.index.src, detail);
}

/* Build
 * ------ */
const build = gulp.series(
  gulp.parallel(views, styles, scripts, images, library, favicon, fonts, index, blog, work, detail)
);
const watch = gulp.parallel(watchFiles, browserSync);
// export tasks
exports.styles = styles;
exports.views = views;
exports.scripts = scripts;
exports.images = images;
exports.library = library;
exports.favicon = favicon;
exports.fonts = fonts;
exports.index = index;
exports.index = blog;
exports.index = work;
exports.index = detail;
exports.build = build;
exports.watch = watch;
exports.default = build;
