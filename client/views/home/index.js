const m = require('mithril')
const {set, push} = require('icepick')
const store = require('../../store')

const initialState = {
	newTodoTitle: 'New Todo',
	todos: []
}

store.addReducer('home', (state, action) => {
	switch (action.type) {
		case 'home:getTodos:success':
			return set(state, 'todos', action.todos)

		case 'home:editNewTodoTitle':
			return set(state, 'newTodoTitle', action.title)

		case 'home:createTodo:start':
			return set(state, 'newTodoTitle', 'New Todo')

		case 'home:createTodo:success':
			return set(state, 'todos', push(state.todos, action.newTodo))

		default:
			return state || initialState
	}
})

function oninit() {
	m.request({
		url: '/graphql',
		method: 'POST',
		data: {request: `query {
			todos {
				id
				title
				completed
			}
		}`}
	})
		.then(res => {
			store.dispatch({
				type: 'home:getTodos:success',
				todos: res.data.todos
			})
		})
}

function createTodo(title) {
	store.dispatch({
		type: 'home:createTodo:start'
	})
	m.request({
		url: '/graphql',
		method: 'POST',
		data: {request: `mutation {
			createTodo(title: "${title}") {
				id
				title
				completed
			}
		}`}
	})
		.then(res => {
			store.dispatch({
				type: 'home:createTodo:success',
				newTodo: res.data.createTodo
			})
		})
}

function homeView() {
	const state = store.getState()

	return m('div', [
		m('input', {
			value: state.home.newTodoTitle,
			oninput(e) {
				store.dispatch({
					type: 'home:editNewTodoTitle',
					title: e.target.value
				})
			}
		}),
		m('h3', state.home.newTodoTitle),
		m('button', {
			innerText: 'Create Todo',
			onclick() {
				createTodo(state.home.newTodoTitle)
			}
		}),
		m('div', [
			m('ul', state.home.todos.map(todo => {
				return m('li', todo.title)
			}))
		])
	])
}

module.exports = {view: homeView, oninit}
