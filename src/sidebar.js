import { registerPlugin } from '@wordpress/plugins'
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post'
import { createElement as el } from '@wordpress/element'
import { select, withSelect, withDispatch } from '@wordpress/data'
import { TextareaControl } from '@wordpress/components'
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
			'div',
			{
				className: 'url-wrapper'
			},
			el(
				'label',
				{
					for: 'codepen-url'
				},
				'CodePen URL'
			),
			el(
				'input',
				{
					className: 'url-input',
					id: 'codepen-url',
					type: 'url',
					value: codePenURL,
					onChange: ( content ) => {
						setCodePenURL( content.nativeEvent.target.value )
					}
				}
			)
		)
	)
} )

const Technologies = compose(
	withSelect( select => {
		return {
			technologies: select( 'core/editor' ).getEditedPostAttribute( 'meta' )[ 'sc_recent_posts_technologies' ]
		}
	} ),
	withDispatch( dispatch => {
		return {
			setTechnologies: ( value ) => {
				dispatch( 'core/editor' ).editPost(
					{ meta: { sc_recent_posts_technologies: value } }
				)
			}
		}
	} )
)( props => {
	const { technologies, setTechnologies } = props

	return (
		el(
			TextareaControl,
			{
				label: 'Technologies Used',
				value: technologies,
				onChange: ( content ) => {
					setTechnologies( content )
				}
			}
		)
	)
} )

const Inspiration = compose(
	withSelect( select => {
		return {
			inspiration: select( 'core/editor' ).getEditedPostAttribute( 'meta' )[ 'sc_recent_posts_inspiration' ]
		}
	} ),
	withDispatch( dispatch => {
		return {
			setInspiration: ( value ) => {
				dispatch( 'core/editor' ).editPost(
					{ meta: { sc_recent_posts_inspiration: value } }
				)
			}
		}
	} )
)( props => {
	const { inspiration, setInspiration } = props

	return (
		el(
			TextareaControl,
			{
				label: 'Inspiration',
				value: inspiration,
				onChange: ( content ) => {
					setInspiration( content )
				}
			}
		)
	)
} )

registerPlugin( 'sc-recent-posts-sidebar', {
	render: () => {
		const MoreMenuItem = el(
			PluginSidebarMoreMenuItem,
			{
				target: 'sc-recent-posts-sidebar',
				icon: 'admin-site-alt2'
			},
			'Additional Information'
		)
		const Sidebar = el(
			PluginSidebar,
			{
				name: 'sc-recent-posts-sidebar',
				icon: 'admin-post',
				title: 'Additional Information'
			},
			el(
				CodePenURL,
				{}
			),
			el(
				Technologies,
				{}
			),
			el(
				Inspiration,
				{}
			)
		)

		return ( [
			( 'projects' === select( 'core/editor' ).getCurrentPost().type && [ MoreMenuItem, Sidebar ] )
		] )
	}
} )
