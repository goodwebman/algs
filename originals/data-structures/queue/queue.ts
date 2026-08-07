class Queue<T> {
	private items: Record<number, T> = {}
	private head = 0
	private tail = 0

	enqueue(element: T): void {
		this.items[this.tail] = element
		this.tail++
	} // push

	dequeue(): T | undefined {
		if (this.isEmpty()) return undefined

		const item = this.items[this.head]
		delete this.items[this.head]
		this.head++

		return item
	} // shift

	peek(): T | undefined {
		return this.items[this.head]
	}

	size(): number {
		return this.tail - this.head
	}

	isEmpty(): boolean {
		return this.size() === 0
	}
}

const queue = []

queue.push(1)
queue.push(2)
queue.push(3)
while (queue.length > 0) {
	console.log(queue.shift())
}

