const path = require( 'path' )
const dependency = require( '@wordpress/dependency-extraction-webpack-plugin' )

const isProduction = 'production' === process.env.NODE_ENV
const mode = isProduction ? 'production' : 'development';

module.exports = {
	mode,
	entry: {
		block: path.resolve( process.cwd(), 'src', 'block.js' ),
		sidebar: path.resolve( process.cwd(), 'src', 'sidebar.js' )
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
		new dependency()
	],
	stats: {
		children: false
	}
}
