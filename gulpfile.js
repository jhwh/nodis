'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-ruby-sass');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var concatCss = require('gulp-concat-css');
var imageop = require('gulp-image-optimization');

var config = {
    bowerDir: 'bower_components'
}

gulp.task('sass', function() {
    return sass('assets/scss/**/*.scss', {
            // style: 'compressed',
            loadPath: [
                config.bowerDir + '/bootstrap-sass/assets/stylesheets',
                config.bowerDir + '/font-awesome/scss',
                config.bowerDir + '/select2-bootstrap-css/compass/stylesheets',
                'assets/scss/modules',
            ]
        })
        .pipe(gulp.dest('build/css'))
        .pipe(livereload());

});

// gulp.task('styles', function () {
//    return gulp.src([
// //        config.bowerDir + '/onepage-scroll/onepage-scroll.css',
//        config.bowerDir + '/fullpage.js/jquery.fullPage.css',
//        config.bowerDir + '/hover/css/hover.css',
//        config.bowerDir + '/video.js/dist/video-js/video-js.css',
//        config.bowerDir + '/animate.css/animate.min.css',
//        config.bowerDir + '/OwlCarousel/owl-carousel/owl.carousel.css'

//    ])
//            .pipe(concatCss("all.css"))
//            .pipe(gulp.dest('build/css'));
// });
gulp.task('images', function(cb) {
    gulp.src(['assets/images/**/*.png',
        'assets/images/**/*.jpg',
        'assets/images/**/*.gif',
        'assets/images/**/*.jpeg',
    ]).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('build/images')).on('end', cb).on('error', cb);
});
gulp.task('scripts', function() {
    return gulp.src([
            config.bowerDir + '/jquery/dist/jquery.min.js',
            config.bowerDir + '/jquery-ui/jquery-ui.js',
            config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.js',
            'assets/javascript/custom.js',
        ])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/javascript'));
});

gulp.task('fonts', function() {
    return gulp.src([
            config.bowerDir + '/bootstrap-sass/assets/fonts/bootstrap/**.*',
            config.bowerDir + '/font-awesome/fonts/**.*',
        ])
        .pipe(gulp.dest('build/fonts'));
});

gulp.task('watch', function() {
    gulp.watch('assets/scss/theme/**', ['sass']);
    gulp.watch('assets/javascript/**', ['scripts']);
    livereload.listen();
});


gulp.task('default', ['sass', 'scripts', 'fonts', 'watch']);
