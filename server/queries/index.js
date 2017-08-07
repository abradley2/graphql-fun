const {GraphQLObjectType, GraphQLList} = require('graphql')

module.exports = new GraphQLObjectType({
	name: 'Query',
	fields: {
		todos: {
			type: new GraphQLList(require('../models').Todo),
			resolve: () => {
				global.console.log('RESOLVER HITss')
				return Promise.resolve([
					{title: 'Write Code', completed: false}
				])
			}
		}
	}
})
