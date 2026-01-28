class EventEmitter {
	constructor() {
		this.events = {}
	}

	on(event, listener) {
		if (!this.events[event]) {
			this.events[event] = []
		}

		this.events[event].push(listener)
		return this
	}
	off(event, listener) {
		if (!this.events[event]) return this
		this.events[event] = this.events[event].filter(ev !== listener)
		return this
	}

	emit(event, ...args) {
		if (!this.events[event]) return this
		this.events[event].forEach(listener => {
			try {
				listener(...args)
			} catch (err) {
				console.error(err)
			}
		})
		return this
	}
}
