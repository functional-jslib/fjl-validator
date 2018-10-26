/**
 * @todo Consolidate use of hard-coded path strings in this file into './gulpfileConfig.json'.
 */
const

    /** System and config includes **/
    path = require('path'),
    fs = require('fs'),
    packageJson = require('./package'),
    {buildConfig, buildConfig: {srcsGlob}} = packageJson,

    /** Gulp Modules (or modules used by gulp) **/
    gulp =          require('gulp'),
    concat =        require('gulp-concat'),
    eslint =        require('gulp-eslint'),
    header =        require('gulp-header'),
    uglify =        require('gulp-uglify'),
    jsdoc =         require('gulp-jsdoc3'),
    gulpRollup =    require('gulp-better-rollup'),
    gulpBabel =     require('gulp-babel'),

    /** Rollup plugins **/
    rollup = require('rollup'),
    rollupBabel = require('rollup-plugin-babel'),
    rollupResolve = require('rollup-plugin-node-resolve'),

    /** Util Modules **/
    del = require('del'),
    moduleMemberListsReadStream = require('./node-scripts/moduleMemberListsReadStream'),
    getReadStreamFinish = (resolve, reject) => err => err ? reject(err) : resolve(),

    /** Paths **/
    {docs: docsBuildPath, dist: buildPathRoot} = buildConfig.paths,

    buildPath = (...tails) => path.join(buildPathRoot, ...tails),

    log = console.log.bind(console),

    // Build paths
    cjsBuildPath = buildPath(buildConfig.folderNames.cjs),
    amdBuildPath  = buildPath(buildConfig.folderNames.amd),
    umdBuildPath  = buildPath(buildConfig.folderNames.umd),
    iifeBuildPath  = buildPath(buildConfig.folderNames.iife),
    es6BuildPath  = buildPath(buildConfig.folderNames.es6Module),
    packageBuildPath  = buildPath(buildConfig.folderNames.package),

    // Module names
    {outputFileNameMin, outputFileName, outputFileNameMjs, inputModuleName} = buildConfig,

    {series, dest, src, parallel} = gulp,

    deleteFilePaths = pathsToDelete =>
        del(pathsToDelete)
            .then(deletedPaths => {
                if (deletedPaths.length) {
                    log('\nThe following paths have been deleted: \n - ' + deletedPaths.join('\n -'));
                    return;
                }
                log(' - No paths to clean.\n', '--mandatory');
            })
            .catch(log),

    cleanTask = () => {
        let pathsToDelete = [cjsBuildPath, amdBuildPath, umdBuildPath, iifeBuildPath, es6BuildPath]
            .map(partialPath => path.join(partialPath, '**', '*.js'));
        return deleteFilePaths(pathsToDelete);
    },

    eslintTask = () =>
        src([srcsGlob, '!node_modules/**'])
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failOnError()),

    umdTask = () =>
        src(srcsGlob)
        .pipe(gulpBabel(buildConfig.buildUmdOptions.babel))
        .pipe(dest(umdBuildPath)),

    amdTask = () =>
        src(srcsGlob)
            .pipe(gulpBabel(buildConfig.buildAmdOptions.babel))
            .pipe(dest(amdBuildPath)),

    cjsTask = () =>
        src(srcsGlob)
            .pipe(gulpBabel(buildConfig.buildCjsOptions.babel))
            .pipe(dest(cjsBuildPath)),

    iifeTask = () =>
        rollup.rollup({
            input: `src/${inputModuleName}.js`,
            plugins: [
                rollupResolve(),
                rollupBabel({
                    babelrc: false,
                    presets: [
                        [
                            'es2015',
                            {
                                modules: false
                            }
                        ]
                    ],
                    plugins: [
                        'external-helpers'
                    ],
                    exclude: 'node_modules/**' // only transpile our source code
                })
            ]
        })
        .then(bundle => bundle.write({
            file: path.join(iifeBuildPath, outputFileName),
            format: 'iife',
            name: inputModuleName,
            sourcemap: true
        })),

    es6ModuleTask = () =>
        src(`./src/${inputModuleName}.js`)
            .pipe(gulpRollup(null, {moduleName: inputModuleName, format: 'es'}))
            .pipe(concat(path.join(es6BuildPath, outputFileName)))
            .pipe(dest('./')),

    uglifyTask = () => {
        const data = {};
        return src(path.join(iifeBuildPath, outputFileName))
            .pipe(concat(path.join(iifeBuildPath, outputFileNameMin)))
            .pipe(uglify(buildConfig.uglifyOptions))
            .pipe(header('/**! ' + outputFileName + ' <%= version %> | License: <%= license %> | ' +
                'Built-on: <%= (new Date()) %> **/', Object.assign(data, packageJson)))
            .pipe(dest('./'));
    },

    buildJsForPackageTask = () => {
        return src(`./src/${inputModuleName}.js`)
            .pipe(gulpRollup(null, {moduleName: inputModuleName, format: 'es'}))
            .pipe(concat(path.join(packageBuildPath, outputFileNameMjs)))
            .pipe(dest('./'))
            .pipe(gulpBabel(buildConfig.buildCjsOptions.babel))
            .pipe(concat(path.join(packageBuildPath, outputFileName)))
            .pipe(dest('./'));
    },

    buildJsTask = parallel(series(iifeTask, uglifyTask), cjsTask, amdTask, umdTask, es6ModuleTask, buildJsForPackageTask),

    buildTask = series(cleanTask, buildJsTask),

    readmeTask = () => {
        const moduleMemberListOutputPath = './markdown-fragments-generated/module-and-member-list.md';

        return deleteFilePaths([
            './markdown-fragments-generated/*.md',
            './README.md'
        ])
            .then(() => new Promise((resolve, reject) => moduleMemberListsReadStream()
                .pipe(fs.createWriteStream(moduleMemberListOutputPath))
                .on('finish', getReadStreamFinish(resolve, reject))
            ))
            .then(() => new Promise((resolve, reject) => gulp.src(buildConfig.readme)
                .pipe(concat('./README.md'))
                .pipe(gulp.dest('./'))
                .on('finish', getReadStreamFinish(resolve, reject))
            ));
    },

    docTask = series(readmeTask, function docTask () {
        return deleteFilePaths([`${docsBuildPath}/**/*`])
            .then(() => new Promise((resolve, reject) =>
                src(['README.md', srcsGlob])
                    .on('finish', getReadStreamFinish(resolve, reject))
                    .pipe(jsdoc(buildConfig.jsdoc))
            ));
    }),

    watchTask = series(buildTask, function watchTask () {
            return gulp.watch([srcsGlob, './node_modules/**'], buildJsTask);
        }
    );

    gulp.task('eslint', eslintTask);

    gulp.task('build', buildTask);

    gulp.task('readme', readmeTask);

    gulp.task('docs', docTask);

    gulp.task('watch', watchTask);

    gulp.task('default', watchTask);
