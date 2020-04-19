import { registerBlockType } from '@wordpress/blocks'
import edit from './edit.js'

registerBlockType( 'sc/recent-posts', {
	title: 'Recent Posts',
	icon: 'editor-ol',
	category: 'common',
	attributes: {
		backgroundImage: {
			type: 'string',
			default: ''
		},
		selectedType: {
			type: 'string',
			default: 'post'
		},
		postsPerBlock: {
			type: 'number',
			default: 5
		}
	},
	edit
} )
