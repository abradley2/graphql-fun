const uuid = require('uuid/v4')
const {GraphQLObjectType, GraphQLString, GraphQLBoolean} = require('graphql')
const series = require('run-series')
const {deferred} = require('../utils')

module.exports = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		toggleTodoCompleted: {
			type: GraphQLBoolean,
			resolve: (obj, {id, completed}, ctx) => {
				const {resolve, reject, promise} = deferred()
				const db = ctx.db
				let todo

				series([
					next => {
						db.get(id, (err, data) => {
							if (err) {
								next(err)
							}
							todo = JSON.parse(data)
							next()
						})
					},
					next => {
						todo.completed = completed
						db.put(id, todo, next)
					}
				], err => {
					if (err) {
						return reject(err)
					}
					return resolve(todo)
				})

				return promise
			}
		},
		deleteTodo: {
			type: GraphQLString,
			resolve: (obj, {id}, ctx) => {
				const {resolve, reject, promise} = deferred()
				const db = ctx.db

				db.del(id, err => {
					if (err) {
						return reject(err)
					}
					return resolve('success')
				})

				return promise
			}
		},
		createTodo: {
			type: require('../models').Todo,
			args: {
				title: {
					type: GraphQLString
				}
			},
			resolve: (obj, {title}, ctx) => {
				const {resolve, reject, promise} = deferred()
				const db = ctx.db

				const newTodo = {
					id: uuid(),
					title,
					completed: false
				}

				db.put(`todos!${newTodo.id}`, JSON.stringify(newTodo), err => {
					if (err) {
						reject(err)
					}
					resolve(newTodo)
				})

				return promise
			}
		}
	}
})
