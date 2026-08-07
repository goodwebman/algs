// Бинарное дерево — это структура данных, где:
// каждый узел имеет не более двух потомков
// обычно называют: left right

// Операция	Лучший случай	Средний	Худший
// Search	O(log n)	O(log n)	O(n)
// Insert	O(log n)	O(log n)	O(n)
// Delete	O(log n)	O(log n)	O(n)

class Node {
	constructor(value) {
		this.value = value
		this.left = null
		this.right = null
	}
}

class BinarySearchTree {
	constructor() {
		this.root = null
	}
	insert(value) {
		const newNode = new Node(value)
		if (!this.root) {
			this.root = newNode
			return
		}

		let current = this.root
		while (true) {
			if (value < current.value) {
				if (!current.left) {
					current.left = newNode
					return
				}
				current = current.left
			} else {
				if (!current.right) {
					current.right = newNode
					return
				}
				current = current.right
			}
		}
	}
	search(value) {
		let current = this.root
		while (current) {
			if (value === current.value) return true
			current = value < current.value ? current.left : current.right
		}
		return false
	}
}
