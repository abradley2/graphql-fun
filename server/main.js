const fs = require('fs')
const http = require('http')
const path = require('path')
// Do you like pino coladaaaaas? Getting caught in the rain??
const log = require('pino')()
const corsify = require('corsify')
const app = require('merry')()
const level = require('level')
const WebSocket = require('ws')
const nodeStatic = require('node-static')
const {buildSchema, graphql} = require('graphql')
const middleware = require('./middleware')

const fileServer = new nodeStatic.Server(path.join(__dirname, '../public'))

const schema = buildSchema(fs.readFileSync(path.join(__dirname, '../schema.graphql'), 'utf8'))
const queries = require('./queries')
const mutations = require('./mutations')
const subscriptions = require('./subscriptions')

app.route('POST', '/gql', applyMiddleware((req, res, ctx) => {
	const resolvers = Object.assign({},
		queries(req, ctx),
		mutations(req, ctx),
		subscriptions(req, ctx)
	)

	graphql(schema, req.body.request, resolvers)
		.then(response => ctx.send(200, response))
		.catch(err => {
			ctx.log.error({name: 'graphql error'}, err)
			ctx.send(500, err)
		})
}))

app.route('default', (req, res, ctx) => {
	fileServer.serve(req, res, e => {
		if (e) {
			ctx.send(404, 'Cruisin down the streets in my 404')
		}
	})
})

// Initialize server
const handler = app.start()
const server = http.createServer(corsify((req, res) => handler(req, res)))

// Add WebSocket Server and DB handler to locals
const db = level('./db')
const wss = new WebSocket.Server({server})

// Start server and listen on port
server.listen(process.env.PORT, () => {
	log.info({name: 'server/start'}, `Server listening on port ${process.env.PORT}`)
})

// Apply middleware
function applyMiddleware(handlerFunc) {
	return (req, res, ctx) => runSeries(
		[
			next => next(null, Object.assign(ctx, {db, wss})),
			next => middleware.readBody(req, res, ctx, next),
			next => middleware.setupSession(req, res, ctx, next)
		],
		err => {
			if (err) {
				ctx.log.error({name: 'middleware error'}, err)
				ctx.send(500, err)
				return
			}
			handlerFunc(req, res, ctx)
		}
	)
}

function runSeries(funcs, cb) {
	(function run(idx) {
		funcs[idx](err => {
			if (err || idx === funcs.length - 1) {
				return cb(err)
			}
			return run(idx + 1)
		})
	})(0)
}
