var gulp         = require('gulp'), // Gulp
    sass         = require('gulp-sass'), // Sass
    browserSync  = require('browser-sync'), // Browser Sync
    concat       = require('gulp-concat'), // gulp-concat (для конкатенации файлов)
    uglify       = require('gulp-uglify'), // gulp-uglifyjs (для сжатия JS)
    cssnano      = require('gulp-cssnano'), // Минификация CSS
    rename       = require('gulp-rename'), // Переименования файлов
    del          = require('del'), // Удаления файлов и папок
    imagemin     = require('gulp-imagemin'), // Работа с изображениями
    cache        = require('gulp-cache'), // Кеширование
    autoprefixer = require('gulp-autoprefixer'),// Автоматическое добавление префиксов
    pug          = require('gulp-pug'), // Pug
    fs           = require('fs') // Для работы с файловой системой
    plumber      = require('gulp-plumber'); //слежка за ошибками( что бы не вылетал галп)

gulp.task('pug', function(){
    return gulp.src([
    'app/pug/pages/*.pug'
    ]) //Берет файлы за исключением блоков подключаемых к странице, экстенда и миксинов
        .pipe(plumber())
        .pipe(pug({
            locals: {},//JSON.parse(fs.readFileSync('sitedata.json', 'utf-8')),
            pretty: true 
        })) // преобразует файлы в html
        .pipe(gulp.dest('app/'))// Сохраняет файлы html
        .pipe(browserSync.reload({stream: true}))// Обновлять html на странице при изменении
})
gulp.task('sass', function(){ 
    return gulp.src('app/sass/**/*.sass') // Источник
        .pipe(sass()) // Преобразование Sass в CSS посредством gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создание префиксов
        .pipe(gulp.dest('app/css')) // Сохранение результата в папку app/css
        .pipe(browserSync.reload({stream: true})) // Обновлять CSS на странице при изменении
});

gulp.task('browser-sync', function() { 
    browserSync({ 
        server: { // Параметры сервера
            baseDir: 'app/' // Директория для сервера
        },
        notify: true // Отключать уведомления
    });
});

gulp.task('scripts', function() {
    return gulp.src([ // Все необходимые библиотеки
        'node_modules/jquery/dist/jquery.min.js' // jQuery
        ])
        .pipe(concat('libs.min.js')) // Собрать все библиотеки в новом файле libs.min.js
        .pipe(uglify()) // Сжать созданный JS файл
        .pipe(gulp.dest('app/js')); // Выгрузить в указанную папку
});

gulp.task('css-libs', ['sass'], function() {
    return gulp.src([
        'node_modules/normalize.css/normalize.css' // Подключение нормалайза
        ])
        .pipe(concat('libs.css')) 
        .pipe(cssnano()) // Сжимает
        .pipe(rename({suffix: '.min'})) // Добавляет суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружает в папку app/css
});

gulp.task('watch', ['browser-sync', 'pug', 'css-libs', 'scripts'], function() {
    gulp.watch('app/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами в папке sass
    gulp.watch('app/pug/**/*.pug', ['pug']); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});

gulp.task('clean', function() {
    return del.sync('dist'); // Удаляет папку dist перед сборкой
});

gulp.task('img', function() {
    return gulp.src('app/imges/**/*') // Берет все изображения из app
        .pipe(cache(imagemin({  // Сжимает их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')); // Выгружает на продакшен
});

gulp.task('build', ['clean', 'img', 'pug', 'sass', 'scripts'], function() {

    var buildCss = gulp.src([ // Переносит библиотеки в продакшен
        'app/css/main.css',
        'app/css/libs.min.css'
        ])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*') // Переносит шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*') // Переносит скрипты в продакшен
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html') // Переносит HTML в продакшен
    .pipe(gulp.dest('dist'));

});

gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('default', ['watch']);