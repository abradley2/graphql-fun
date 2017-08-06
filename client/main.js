const m = require('mithril')
const css = require('sheetify')
const clientId = require('shortid').generate()
const store = require('./store')
const home = require('./views/home')

css('./main.css')

store.init()

const appName = 'MithrilReduxBoilerplate'
const development = process.env.NODE_ENV === 'development'
const serverUrl = process.env.SERVER_URL || 'localhost:5000'

function startApp(err) {
	if (err) {
		window.console.error(err)
	}

	m.route(document.getElementById('app'), '/', {
		'/': home
	})

	const ws = new WebSocket('ws://' + serverUrl)

	ws.onopen = function () {
		window.console.log('socket open!')
	}
}

// Wrap request to hit local host
m.request = (function (mRequest) {
	return function (opts) {
		if (opts.url[0] === '/') {
			opts.url = serverUrl + opts.url
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
