var gulp = require( 'gulp' ),
	postCSS = require( 'gulp-postcss' ),
	webpack = require( 'webpack' ),
	stream = require( 'webpack-stream' )

gulp.task( 'styles', function() {
	return gulp.src( './src/css/style.css' )
		.pipe( postCSS() )
		.pipe( gulp.dest( '.' ) )
} )

gulp.task( 'scripts', function() {
	return gulp.src( './src/js/*.js' )
		.pipe( stream( require( './webpack.config.js' ), webpack ) )
		.pipe( gulp.dest( './js' ) )
} )

gulp.task( 'watch', function() {
	gulp.watch( './src/**/*.css', gulp.series( 'styles' ) )
	gulp.watch( './src/**/*.js', gulp.series( 'scripts' ) )
} )
