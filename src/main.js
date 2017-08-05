const m = require('mithril')
const css = require('sheetify')
const clientId = require('shortid').generate()
const store = require('./store')
const home = require('./modules/home')

css('./main.css')

store.init()

const appName = 'MithrilReduxBoilerplate'

function startApp(err) {
	if (err) {
		window.console.error(err)
	}

	m.route(document.getElementById('app'), '/', {
		'/': home
	})

	const ws = new WebSocket('ws://localhost:5000')

	ws.onopen = function () {
		window.console.log('socket open!')
	}
}

const development = process.env.NODE_ENV === 'development'

// Wrap request to hit local host
m.request = (function (mRequest) {
	return function (opts) {
		if (opts.url[0] === '/' && development) {
			opts.url = 'http://localhost:5000' + opts.url
		}
		if (opts.data && opts.data.mutation) {
			opts.data.clientId = clientId
		}
		return mRequest.call(m, opts)
	}
})(m.request)

if (development) {
	// Enable state persist then start app
	require('./utils/persist')(appName, store, startApp)
} else {
	startApp()
}
