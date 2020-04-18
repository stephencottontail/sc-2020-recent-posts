import { registerPlugin } from '@wordpress/plugins'
import { PluginSidebar } from '@wordpress/edit-post'
import { createElement as el } from '@wordpress/element'
import { select, withSelect, withDispatch } from '@wordpress/data'
import { compose } from '@wordpress/compose'

const CodePenURL = compose(
	withSelect( select => {
		return {
			codePenURL: select( 'core/editor' ).getEditedPostAttribute( 'meta' )[ 'sc_recent_posts_codepen_url' ]
		}
	} ),
	withDispatch( dispatch => {
		return {
			setCodePenURL: ( value ) => {
				dispatch( 'core/editor' ).editPost(
					{ meta: { sc_recent_posts_codepen_url: value } }
				)
			}
		}
	} )
)( props => {
	const { codePenURL, setCodePenURL } = props

	return (
		el(
			'input',
			{
				className: 'url-input',
				type: 'url',
				value: codePenURL,
				onChange: ( content ) => {
					setCodePenURL( content.nativeEvent.target.value )
				}
			}
		)
	)
} )

registerPlugin( 'sc-recent-posts-sidebar', {
	render: () => {
		const Sidebar = el(
			PluginSidebar,
			{
				name: 'sc-recent-posts-sidebar',
				icon: 'admin-post',
				title: 'Project URL'
			},
			el(
				CodePenURL,
				{}
			)
		)

		return ( 'projects' === select( 'core/editor' ).getCurrentPost().type && Sidebar )
	}
} )
