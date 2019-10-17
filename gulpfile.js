// Importerar diverse metoder från Gulp
const {src, dest, series, parallel, watch} = require('gulp');
// Importerar paketet "gulp-uglify-es" som minifierar JS-filer
const uglify = require('gulp-uglify-es').default;
// Importerar paketet "gulp-concat" som konkatenerar filer till en fil
const concat = require('gulp-concat');
// Importerar paketet "gulp-clean" som tar bort filer och kataloger
const clean = require('gulp-clean');
// Importerar live-reload
const browserSync = require('browser-sync').create();
// Importerar paketet "gulp-minifier" för att minifiera html-, css- och js-filer.
const minify = require('gulp-minifier');
// Importerar paketet "gulp-sass" för att konvertera sass/scss till vanlig css
const sass = require('gulp-sass');
// Node Sass används som kompilerare
sass.compiler = require('node-sass');
// Importerar paketet "gulp-sourcemaps" som fixar sourcemaps för att lättare hitta vart kod är skriven
const sourcemaps = require('gulp-sourcemaps');
// Importerar paketet "gulp-imagemin" som komprimerar PNG-, JPEG-, GIF- och SVG-bilder 
const imagemin = require('gulp-imagemin');
// Importerar paketet "gulp-babel" för att kunna transpilera =>ES6 till ES5
const babel = require('gulp-babel');



// Object som lagrar sökvägar till de olika arbetsfilerna
const files = {
    htmlPath: 'src/**/*.html',
    phpPath: 'src/**/*.php',
    cssPath: 'src/**/*.css',
    sassPath: 'src/scss/*.scss',
    jsPath: 'src/**/*.js',
    imgPath: 'src/images/**/*.*',
    buildPath: './build/'
}


// Städa bort allt ur build-katalogen
function cleanTask(cb) {
    return src(files.buildPath)
        .pipe(clean());
};



// Kopiera HTML-filer till build-katalogen. Ladda sedan om sidan
function copyHTML() {
    return src(files.htmlPath)
        .pipe(dest(files.buildPath))
        .pipe(browserSync.stream())
}
function copyPHP() {
    return src(files.phpPath)
        .pipe(dest(files.buildPath))
        .pipe(browserSync.stream())
}

// Kopiera Bild-filer till build-katalogen. Ladda sedan om sidan
function copyIMG() {
    return src(files.imgPath)
        .pipe(imagemin())
        .pipe(dest(files.buildPath + 'images'))
        .pipe(browserSync.stream())
}

// Konkatera, minifiera och kopiera sedan över filen till build-katalogen. Ladda sedan om sidan
function cssTask() {
    return src(files.cssPath)
        .pipe(concat('style.css'))
        .pipe(minify({
            minify: true,
            minifyCSS: true
        }))
        .pipe(dest(files.buildPath + 'css'))
        .pipe(browserSync.stream())
}

function sassTask() {
    return src(files.sassPath)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(dest(files.buildPath + 'css'))
        .pipe(browserSync.stream())
}

// Transpilera, konkatera, minifiera och kopiera sedan över filen till build-katalogen. Ladda sedan om sidan
function jsTask() {
    return src(files.jsPath)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(dest(files.buildPath + 'js'))
        .pipe(browserSync.stream())
}

// Funktion för att initiera browserSync och sedan lyssna på förändringar i /src-katalogen
function watchTask() {
    browserSync.init({
        server: {
            baseDir: 'build/'
        }
    });
    watch('./src',
        series(
            parallel(copyHTML,copyPHP,copyIMG,sassTask, jsTask),
        )
    ).on('change', browserSync.reload);
}

exports.default = series(
    cleanTask,
    parallel(copyHTML,copyPHP,copyIMG, jsTask,sassTask),
    watchTask
);

