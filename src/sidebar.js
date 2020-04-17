import { registerPlugin } from '@wordpress/plugins'
import { PluginSidebar } from '@wordpress/edit-post'
import { createElement as el } from '@wordpress/element'
import { select } from '@wordpress/data'

registerPlugin( 'sc-recent-posts-sidebar', {
	render: () => {
		const Sidebar = el(
			PluginSidebar,
			{
				name: 'sc-recent-posts-sidebar',
				icon: 'admin-post',
				title: 'Project URL'
			},
			'URL'
		)

		return ( 'projects' === select( 'core/editor' ).getCurrentPost().type && Sidebar )
	}
} )
		
