const {GraphQLObjectType, GraphQLString, GraphQLBoolean} = require('graphql')

exports.Todo = new GraphQLObjectType({
	name: 'Todo',
	fields: {
		id: {
			type: GraphQLString
		},
		title: {
			type: GraphQLString
		},
		completed: {
			type: GraphQLBoolean
		}
	}
})
