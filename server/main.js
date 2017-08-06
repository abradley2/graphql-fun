const http = require('http')
const path = require('path')
// Do you like pino coladaaaaas? Getting caught in the rain??
const log = require('pino')()
const app = require('merry')()
const level = require('level')
const WebSocket = require('ws')
const nodeStatic = require('node-static')
const middleware = require('./middleware')

const fileServer = new nodeStatic.Server(path.join(__dirname, '../public'))
const locals = {}

// Declare graphql endpoints
app.route('GET', '/gql', routeHandler(require('./queries')))
app.route('PUT', '/gql', routeHandler(require('./mutations')))
app.route('POST', '/gql', routeHandler(require('./subscriptions')))

app.route('default', (req, res, ctx) => {
	fileServer.serve(req, res, e => {
		if (e) {
			ctx.send(404, 'Cruisin down the streets in my 404')
		}
	})
})

// Initialize server
const handler = app.start()
const server = http.createServer((req, res) => {
	handler(req, res)
})

// Add WebSocket Server and DB handler to locals
locals.db = level('./db')
locals.webSocketServer = new WebSocket.Server({server})

// Start server and listen on port
server.listen(process.env.PORT, () => {
	log.info({name: 'server/start'}, `Server listening on port ${process.env.PORT}`)
})

// Utilities
function routeHandler(handlerFunc) {
	return (req, res, ctx, done) => runSeries(
		[
			next => {
				Object.assign(ctx, locals)
				next()
			},
			next => middleware.setupSession(req, res, ctx, next)
		],
		err => {
			if (err) {
				ctx.log.error({name: 'middleware error '}, err)
				done(err)
			}
			handlerFunc(req, res, ctx, done)
		}
	)
}

function runSeries(funcs, cb) {
	(function run(idx) {
		const err = funcs[idx]()
		if (err || idx === funcs.length - 1) {
			return cb(err)
		}
		return run(idx + 1)
	})(0)
}
