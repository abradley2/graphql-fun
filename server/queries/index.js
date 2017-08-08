const {GraphQLObjectType, GraphQLList} = require('graphql')
const {deferred} = require('../utils')

module.exports = new GraphQLObjectType({
	name: 'Query',
	fields: {
		todos: {
			type: new GraphQLList(require('../models').Todo),
			resolve: (obj, args, ctx) => {
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
		}
	}
})
