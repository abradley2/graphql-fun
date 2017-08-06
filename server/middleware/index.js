exports.setupSession = function (req, res, ctx, next) {
	next()
}

exports.readBody = function (req, res, ctx, next) {
	const body = []

	req
		.on('data', chunk => {
			body.push(chunk)
		})
		.on('end', () => {
			try {
				req.body = JSON.parse(Buffer.concat(body).toString())
			} catch (err) {
				return next(err)
			}
			return next()
		})
}
