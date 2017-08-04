/** @jsx m */
const m = require('mithril')
const {set} = require('icepick')
const store = require('../../store')

const initialState = {
	message: 'test'
}

store.addReducer('home', (prevState, action) => {
	switch (action.type) {
		case 'home:editMessage':
			return set(prevState, 'message', action.message)

		default:
			return prevState || initialState
	}
})

function homeView() {
	const state = store.getState()

	return m('div', [
		m('input', {
			value: state.home.message,
			oninput(e) {
				store.dispatch({
					type: 'home:editMessage',
					message: e.target.value
				})
			}
		}),
		m('h3', state.home.message)
	])
}

module.exports = {view: homeView}
