const m = require('mithril')
const cn = require('classnames')

function button(vnode) {
	const {
		onclick,
		buttonClass = '',
		buttonType = 'default'
	} = vnode.attrs

	const buttonStyles = {
		default: ' white bg-gray',
		primary: ' white bg-green',
		secondary: ' white bg-blue'
	}

	const className = cn(
		'dib tc pa2 lh-solid f4 fw3 pointer br2 shadow-1 ttu tracked mv1 mh2',
		buttonStyles[buttonType],
		buttonClass
	)

	return m('span', {
		className,
		onclick
	}, vnode.children)
}

module.exports = {view: button}
