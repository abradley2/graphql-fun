const m = require('mithril')
const store = require('../../store')
const navbar = require('../components/navbar')

const initialState = {
}

store.addReducer('home', (state, action) => {
	switch (action.type) {
		default:
			return state || initialState
	}
})

function homeView() {
	return m('div', [
		m(navbar)
	])
}

module.exports = {view: homeView}
