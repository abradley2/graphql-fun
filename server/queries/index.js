const queries = () => ({
	todos() {
		return Promise.resolve([
			{title: 'Write code', completed: false}
		])
	}
})

module.exports = queries
