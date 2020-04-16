const path = require( 'path' )
const dependencyExtraction = require( '@wordpress/dependency-extraction-webpack-plugin' )

const isProduction = 'production' === process.env.NODE_ENV
const mode = isProduction ? 'production' : 'development';

module.exports = {
	mode,
	entry: {
		block: path.resolve( process.cwd(), 'src', 'block.js' )
	},
	output: {
		filename: '[name].js',
		path: path.resolve( process.cwd(), 'dist' )
	},
	module: {
		rules: [ {
			test: /\.js$/,
			exclude: /node_modules/,
			use: [ {
				loader: require.resolve( 'babel-loader' ),
				options: {
					presets: [ '@wordpress/default' ]
				}
			} ]
		} ]
	},
	plugins: [
		new dependencyExtraction()
	],
	stats: {
		children: false
	}
}
