const m = require('mithril')
const css = require('sheetify')
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
}

if (process.env.NODE_ENV === 'development') {
	// Wrap request to hit local host
	m.request = (function (mRequest) {
		return function (opts) {
			if (opts.url[0] === '/') {
				opts.url = 'http://localhost:5000' + opts.url
			}
			return mRequest.call(m, opts)
		}
	})(m.request)

	// Enable state persist then start app
	require('./utils/persist')(appName, store, startApp)
} else {
	startApp()
}
