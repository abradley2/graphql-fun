const path = require('path')
const http = require('http')
// Do you like pino coladaaaaas?
// Getting caught in the rain??
const log = require('pino')()
const level = require('level')
const app = require('express')()
const pub = require('express').static
const WebSocket = require('ws')
const api = require('./api')

// In development just let budo serve up static assets
if (process.env.NODE_ENV === 'production') {
	app.use(
		pub(path.join(__dirname, '../public'))
	)
}

// Middleware to watch all requests for mutation queries and send them off
// to connected clients on success
app.use((req, res, next) => {
	// Send off mutation queries to all other clients
	if (req.body && req.body.mutation) {
		const {mutation, clientId} = req.body

		res.on('end', () => {
			// Check to make sure it was successful
			if (res.status >= 200 && res.status < 300) {
				const payload = JSON.stringify({mutation, origin: clientId})

				// Here is where we'd want to add some security checks if we needed them
				app.locals.webSocketServer.clients
					.filter(client => client.readyState === WebSocket.OPEN)
					.forEach(client => client.send(payload))
			}
		})
	}
	next()
})

app.use(api)

const server = http.createServer((req, res) => {
	app(req, res)
})

app.locals.log = log
app.locals.db = level('./db')
app.locals.webSocketServer = new WebSocket.Server({server})

server.listen(process.env.PORT, () => {
	log.info({name: 'server/start'}, `Server listening on port ${process.env.PORT}`)
})
