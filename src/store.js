const m = require('mithril')
const {createStore, combineReducers, compose, applyMiddleware} = require('redux')

// Add additional reducers here
const reducers = {

}

// Add additional middleware here
const middlewares = [

]

const store = {
	reducers,

	addReducer(name, func) {
		store.reducers[name] = func
	},

	init() {
		const reduce = combineReducers(store.reducers)

		let composeEnhancers = compose
		if (process.env.NODE_ENV === 'development') {
			const loggerSettings = {
				diff: true,
				collapsed: true
			}
			composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
			middlewares.push(require('redux-logger').createLogger(loggerSettings))
		}

		const reduxStore = createStore(
			(state, action) => {
				if (action.type === '$LOAD') {
					return action.state
				}
				return reduce(state, action)
			},
			composeEnhancers(applyMiddleware.apply({}, middlewares))
		)

		if (window.__REDUX_DEVTOOLS_EXTENSION__) {
			reduxStore.subscribe(m.redraw.bind(m))
		}

		// Add the reduxStore methods to the store
		store.dispatch = reduxStore.dispatch
		store.getState = reduxStore.getState
		store.subscribe = reduxStore.subscribe
	}
}

module.exports = store
