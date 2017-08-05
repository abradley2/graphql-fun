const router = require('express').Router

const api = router()

api.use('/message', require('./routes/message'))

module.exports = api
