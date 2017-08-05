const router = require('express').Router

const messageRoute = router()

messageRoute.get('/', (req, res) => {
	const log = req.app.locals.log

	log.debug({name: 'routes/message'}, 'Sending message to client')

	res.json({
		message: 'Hello There'
	})
})

module.exports = messageRoute
