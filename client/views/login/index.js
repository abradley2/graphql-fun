const m = require('mithril')
const navbar = require('../components/navbar')

function login() {
	return m('div', [
		m(navbar)
	])
}

module.exports = {view: login}
