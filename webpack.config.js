const path = require( 'path' )

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
	externals: {
		'@wordpress/blocks': 'wp.blocks',
		'@wordpress/block-editor': 'wp.blockEditor',
		'@wordpress/components': 'wp.components',
		'@wordpress/data': 'wp.data',
		'@wordpress/element': 'wp.element',
		'moment': 'window.moment'
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
	stats: {
		children: false
	}
}
