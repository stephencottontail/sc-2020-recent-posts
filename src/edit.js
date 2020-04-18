import { createElement as el } from '@wordpress/element'
import { withSelect } from '@wordpress/data'
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components'
import { InspectorControls } from '@wordpress/block-editor'
import moment from 'moment'

function Edit( props ) {
	const { posts, types, attributes, setAttributes, className } = props
	const { selectedType, postsPerBlock } = attributes

	const Controls = (
		el(
			InspectorControls,
			{},
			el(
				PanelBody,
				{
					className: className,
					title: 'Block Options',
					initialOpen: true
				},
				el(
					SelectControl,
					{
						label: 'Post Type',
						value: selectedType,
						onChange: ( type ) => {
							setAttributes( { selectedType: type } )
						},
						options: ( types && types.map( ( value, index ) => {
							return {
								key: index,
								value: value.slug,
								label: value.name
							}
						} ) )
					}
				),
				el(
					RangeControl,
					{
						label: 'Posts to Show',
						onChange: ( number ) => {
							setAttributes( { postsPerBlock: number } )
						},
						value: postsPerBlock,
						min: 1,
						max: 9
					}
				)
			)
		)
	)

	return ( [
		( types && Controls ),
		el(
			'div',
			{ className: className },
			el(
				'div',
				{ className: `${className}__jsx` },
				el(
					'code',
					{ className: 'jsx' },
					'<',
					el(
						'span',
						{ className: 'jsx-tag' },
						'RecentPosts'
					),
					' ',
					el(
						'span',
						{ className: 'jsx-attr' },
						'type'
					),
					'="',
					el(
						'span',
						{ className: 'jsx-attr-string' },
						selectedType
					),
					'" ',
					el(
						'span',
						{ className: 'jsx-attr' },
						'number',
					),
					'="',
					el(
						'span',
						{ className: 'jsx-attr-string' },
						postsPerBlock
					),
					'">'
				)
			),
			el(
				'div',
				{ className: `${className}__entries` },
				( posts && posts.map( ( value, index ) => {
					console.log( value )
					return (
						el(
							'article',
							{
								key: index,
								className: `${className}__entry`
							},
							el(
								'h2',
								{
									className: `${className}__title`
								},
								el(
									'a',
									{
										href: value.link
									},
									value.title.rendered
								)
							),
							el(
								'time',
								{
									dateTime: value.date
								},
								moment( value.date ).format( 'MMMM Do, YYYY' ) )
						)
					)
				} ) )
			)
		)
	] )
}

export default withSelect( ( select, props ) => {
	const { attributes } = props
	const { selectedType, postsPerBlock } = attributes

	return {
		types: select( 'core' ).getEntityRecords( 'root', 'postType' ),
		posts: select( 'core' ).getEntityRecords( 'postType', selectedType, { per_page: postsPerBlock } )
	}
} )( Edit )
