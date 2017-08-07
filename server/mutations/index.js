const {GraphQLObjectType, GraphQLString, GraphQLBoolean} = require('graphql')

module.exports = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		toggleTodoCompleted: {
			type: GraphQLBoolean,
			resolve: ({id, completed}) => {

			}
		},
		deleteTodo: {
			type: GraphQLString,
			resolve: ({id}) => {

			}
		},
		createTodo: {
			type: require('../models').Todo,
			resolve: ({title}) => {

			}
		}
	}
})
