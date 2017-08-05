const path = require('path')
const http = require('http')
const log = require('pino')()
const app = require('express')()
const pub = require('express').static
const api = require('./api')

// In development just let budo serve up static assets
if (process.env.NODE_ENV === 'production') {
	app.use(
		pub(path.join(__dirname, 'public'))
	)
}

app.use(api)

app.locals.log = log

const server = http.createServer((req, res) => {
	app(req, res)
})

server.listen(process.env.PORT, () => {
	log.info({name: 'server/start'}, `Server listening on port ${process.env.PORT}`)
})
