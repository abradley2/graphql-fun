const m = require('mithril')
const {set} = require('icepick')
const store = require('../../store')

const initialState = {
	message: 'test again'
}

store.addReducer('home', (prevState, action) => {
	switch (action.type) {
		case 'home:editMessage':
			return set(prevState, 'message', action.message)

		default:
			return prevState || initialState
	}
})

function oninit() {
	m.request({
		url: '/graphql',
		method: 'POST',
		data: {request: `{
			todos {
				title
				completed
			}
		}`}
	})
}

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

module.exports = {view: homeView, oninit}
