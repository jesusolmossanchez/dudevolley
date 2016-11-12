/*
* Dependencias
*/
var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  cleanCSS = require('gulp-clean-css');

/*
* Configuración de la tarea  'minimize'
*/

gulp.task('minimize_js', function () {
    gulp.src(['js/Boot.js','js/Preloader.js','js/MainMenu.js','js/Menu1Player.js','js/MovilMainMenu.js','js/PreOnePlayer.js','js/GameOnePlayer.js','js/Entrenamiento.js','js/GameTwoPlayer.js','js/Demo.js','js/GameMultiplayer.js','js/GameOver.js','js/Player.js','js/Joystick.js'])
    .pipe(concat('dudevolley.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js/dist/'))
});

gulp.task('minimize_js_mobile', function () {
    gulp.src(['js_mobile/Boot.js','js_mobile/Preloader.js','js_mobile/MainMenu.js','js_mobile/Menu1Player.js','js_mobile/MovilMainMenu.js','js_mobile/PreOnePlayer.js','js_mobile/GameOnePlayer.js','js_mobile/Entrenamiento.js','js_mobile/GameTwoPlayer.js','js_mobile/Demo.js','js_mobile/GameMultiplayer.js','js_mobile/GameOver.js','js_mobile/Player.js','js_mobile/Joystick.js'])
    .pipe(concat('dudevolley_mobile.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js/dist/'))
});


gulp.task('minimize_css', function () {
  gulp.src(['css/style.css', 'css/jquery.Jcrop.css' ])
  .pipe(concat('dudevolley.min.css'))
  .pipe(cleanCSS())
  .pipe(gulp.dest('css/dist/'))

});




gulp.task('default', ['minimize_js','minimize_js_mobile','minimize_css']);