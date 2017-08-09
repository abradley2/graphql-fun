const {deferred} = require('../utils')

module.exports = {
	Query: {
		todos: (obj, args, ctx) => {
			const {resolve, reject, promise} = deferred()
			const db = ctx.db
			const todos = []

			db.createReadStream({
				gt: 'todos!',
				lt: 'todos~'
			})
				.on('data', data => {
					todos.push(JSON.parse(data.value))
				})
				.on('error', err => {
					reject(err)
				})
				.on('end', () => {
					resolve(todos)
				})

			return promise
		}
	},
	Todo: {
		subtasks: () => {
			return Promise.resolve(['subtask one', 'subtasktwo'])
		}
	}
}
