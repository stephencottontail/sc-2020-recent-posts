import { createElement as el, Component } from '@wordpress/element'

class Edit extends Component {
	constructor( props ) {
		super( props )
	}

	render() {
		const { className } = this.props

		return (
			el(
				'div',
				{
					className: className
				},
				'Hello from the editor!'
			)
		)
	}
}

export default Edit
