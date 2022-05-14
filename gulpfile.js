//------------------Объявление Вводных Данных---------------------------
const { src, dest, parallel, series, watch } = require('gulp');
const del = require('del');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-image');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const notify = require('gulp-notify'); //показывает ошибки в коде
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();


//-----------------------------ФУНКЦИИ----------------------------------
const clean = () => {
  return del(['app'])
}

const resources = () => {
  return src('./src/resources/**')
    .pipe(dest('./app/resources/'))
}

const styles = () => {
  // return src('src/css/**/*.css') //все файлы стилей во всех вложенных в "css" папках
  return src('src/css/style.css') 
    .pipe(sourcemaps.init()) //инициализация sourcemaps
    .pipe(concat('main.css')) //слияние файлов стилей в файл 'main.css' (pipe - перевод "труба")
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(sourcemaps.write()) //запись sourcemaps
    .pipe(dest('./app/css/')) //положить файл main.css в папку 'app'
    .pipe(browserSync.stream()) //browser-sync получает все изменения в файлах
}

const html = () => {
  return src('src/**/*.html')
    .pipe(dest('./app/'))
    .pipe(browserSync.stream()) //browser-sync получает все изменения в файлах      
}

const scripts = () => {
  return src([
    'src/js/components/**/*.js',
    'src/js/main.js'
  ])
  .pipe(sourcemaps.init()) //инициализация sourcemaps
  .pipe(babel({
    presets:['@babel/env']
  }))
  .pipe(concat('app.js'))
  .pipe(sourcemaps.write()) //запись sourcemaps
  .pipe(dest('./app/js/'))
  .pipe(browserSync.stream())
}

const watchFiles = () => { //в отличии от предыдущих, эта ф-ция ничего не должна возвращать
  browserSync.init({
    server: {
      baseDir: './app' //директория оптимизированных файлов
    }
  })

  watch('src/**/*.html', html); //следим за изменениями в html (если есть - запускаем task 'html')
  watch('src/css/**/*.css', styles);
  watch('src/images/svg/**/*.svg', svgSprites);
  watch('src/js/**/*.js', scripts);
  watch('src/resources/**', resources);
}

const svgSprites = () => {
  return src('src/images/svg/**/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest('./app/images'))
}

const images = () => {
  return src([
    'src/images/**/*.jpg',
    'src/images/**/*.png',
    'src/images/*.svg',
    'src/images/**/*.jpeg'
  ])
  .pipe(image())
  .pipe(dest('./app/images'))
}

//---------------Функции для Build-версии------------------------------
const htmlMinifyBuild = () => {
  return src('src/**/*.html')
    .pipe(htmlMin({
      collapseWhitespace: true,
    }))
    .pipe(dest('./app/'))   
}

const stylesBuild = () => {
  return src('src/css/**/*.css') //все файлы стилей во всех вложенных в "css" папках
    .pipe(concat('main.css')) //слияние файлов стилей в файл 'main.css' (pipe - перевод "труба")
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCss({
      level: 2 //уровень оптимизации css
    }))
    .pipe(dest('./app/css/')) //положить файл main.css в папку 'app'
}

const scriptsBuild = () => {
  return src([
    'src/js/components/**/*.js',
    'src/js/main.js'
  ])
  .pipe(babel({
    presets:['@babel/env']
  }))
  .pipe(concat('app.js'))
  .pipe(uglify({
    toplevel: true // уровень обфусцирования (шифрования)
  }).on('error', notify.onError()))
  .pipe(dest('./app/js/'))
}
//----------------------------------------------------------------------



//----------------------Экспорт Функций в Task-и-------------------------
exports.clean = clean;
exports.resources = resources;
exports.styles = styles;
exports.html = html;
exports.svgSprites = svgSprites;
exports.images = images;
exports.scripts = scripts;


exports.default = series(clean, parallel(resources, styles, scripts, html, svgSprites, images), watchFiles);
exports.build = series(clean, resources, htmlMinifyBuild, stylesBuild, scriptsBuild, svgSprites, images);