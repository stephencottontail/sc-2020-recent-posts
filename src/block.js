import { registerBlockType } from '@wordpress/blocks'
import edit from './edit.js'

registerBlockType( 'sc/recent-posts', {
	title: 'Recent Posts',
	icon: 'editor-ol',
	category: 'common',
	edit
} )
