var gulp = require( 'gulp' ),
	webpack = require( 'webpack' ),
	stream = require( 'webpack-stream' )

gulp.task( 'scripts', function() {
	return gulp.src( './src/*.js' )
		.pipe( stream( require( './webpack.config.js' ), webpack ) )
		.pipe( gulp.dest( './dist' ) )
} )

gulp.task( 'watch', function() {
	gulp.watch( './src/**/*.js', gulp.series( 'scripts' ) )
} )
