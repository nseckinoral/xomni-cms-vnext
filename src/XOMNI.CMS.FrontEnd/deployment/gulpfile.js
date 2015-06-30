// There is an issue defined on https://github.com/XomniCloud/xomni-cms-vnext/issues/16 related to this gulp file. 
// Refrain from using this file until the issue is solved. 

// Node modules
var fs = require('fs'), vm = require('vm'), merge = require('deeply'), chalk = require('chalk'), es = require('event-stream');

// Gulp and plugins
var gulp = require('gulp'), rjs = require('gulp-requirejs-bundler'), concat = require('gulp-concat'), clean = require('gulp-clean'),
    replace = require('gulp-replace'), uglify = require('gulp-uglify'), htmlreplace = require('gulp-html-replace'), typescript = require('gulp-tsc');

// Config
var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('src/app/require.config.js') + '; require;');
requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
    out: 'scripts.js',
    baseUrl: './src',
    name: 'app/startup',
    paths: {
        requireLib: 'bower_modules/requirejs/require'
    },
    include: [
        'requireLib',
        'components/menubar/menubar',
        'components/navigation/navigation',
        'components/licence-bar/licence-bar',
        'components/loading-modal/loading-modal',
        'components/message-dialog/message-dialog',
        'pages/home-page/home',
        'text!pages/about-page/about.html'
    ],
    insertRequire: ['app/startup'],
    bundles: {
        // [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]
        'bundle-page-private-analytics-summary': ['pages/private/analytics-summary'],
        'bundle-page-management-integration-endpoint': ['pages/management/integration-endpoint'],
        'bundle-page-management-tenant-settings': ['pages/management/tenant-settings'],
        'bundle-page-management-msg-integration': ['pages/management/msg-integration'],
        'bundle-page-management-facebook-settings': ['pages/management/facebok-settings'],
        'bundle-page-management-twitter-settings': ['pages/management/twitter-settings'],
        'bundle-page-private-mail-subscription-status': ['pages/private/mail-subscription-status']
			//[[XO-SCAFFOLDER]]
    }
});

// Compile all .ts files, producing .js and source map files alongside them
gulp.task('ts', function () {
    return gulp.src(['**/*.ts'])
        .pipe(typescript({
            module: 'amd',
            sourcemap: true,
            outDir: './'
        }))
        .pipe(gulp.dest('./'));
});

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('js', ['ts'], function () {
    return rjs(requireJsOptimizerConfig)
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(gulp.dest('./dist/'));
});

// Concatenates CSS files, rewrites relative paths to Bootstrap fonts, copies Bootstrap fonts
gulp.task('css', function () {
    var bowerCss = gulp.src('src/bower_modules/components-bootstrap/css/bootstrap.min.css')
            .pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/')),
        appCss = gulp.src('src/css/*.css'),
        combinedCss = es.concat(bowerCss, appCss).pipe(concat('css.css')),
        fontFiles = gulp.src('./src/bower_modules/components-bootstrap/fonts/*', { base: './src/bower_modules/components-bootstrap/' });
    return es.concat(combinedCss, fontFiles)
        .pipe(gulp.dest('./dist/'));
});

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('html', function () {
    return gulp.src('./src/index.html')
        .pipe(htmlreplace({
            'css': 'css.css',
            'js': 'scripts.js'
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('img', function () {
    return gulp.src('src/images/**')
        .pipe(gulp.dest('./dist/images'));
});

gulp.task('font', function () {
    return gulp.src('src/fonts/**')
        .pipe(gulp.dest('./dist/fonts'));
});

// Removes all files from ./dist/, and the .js/.js.map files compiled from .ts
gulp.task('clean', function () {
    var distContents = gulp.src('./dist/**/*', { read: false }),
        generatedJs = gulp.src(['src/**/*.js', 'src/**/*.js.map', 'test/**/*.js', 'test/**/*.js.map'], { read: false })
            .pipe(es.mapSync(function (data) {
                // Include only the .js/.js.map files that correspond to a .ts file
                return fs.existsSync(data.path.replace(/\.js(\.map)?$/, '.ts')) ? data : undefined;
            }));
    return es.merge(distContents, generatedJs).pipe(clean());
});

gulp.task('default', ['html', 'js', 'css', 'img', 'font'], function (callback) {
    callback();
    console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
});
