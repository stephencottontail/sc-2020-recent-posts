import { createElement as el } from '@wordpress/element'
import { withSelect } from '@wordpress/data'
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components'
import { InspectorControls } from '@wordpress/block-editor'

function Edit( props ) {
	const { types, attributes, setAttributes, className } = props
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
			'p',
			{ className: className },
			'Hello from the editor!'
		)
	] )
}

export default withSelect( select => {
	return {
		types: select( 'core' ).getEntityRecords( 'root', 'postType' )
	}
} )( Edit )
