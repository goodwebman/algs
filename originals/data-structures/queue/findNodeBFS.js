const tree = {
	id: 'root',
	name: 'Products',
	children: [
		{
			id: 'electronics',
			name: 'Electronics',
			children: [
				{
					id: 'phones',
					name: 'Phones',
					children: [
						{ id: 'iphone', name: 'iPhone' },
						{ id: 'pixel', name: 'Google Pixel' },
					],
				},
				{
					id: 'laptops',
					name: 'Laptops',
					children: [{ id: 'macbook', name: 'MacBook Pro' }],
				},
			],
		},
		{
			id: 'clothing',
			name: 'Clothing',
			children: [
				{ id: 'tshirts', name: 'T-Shirts' },
				{ id: 'hoodies', name: 'Hoodies' },
			],
		},
	],
}

const findNodeBFS = (tree, targetId) => {
	const queue = [tree]

	while (queue.length) {
		const node = queue.shift()

		if (node.children) {
			queue.push(...node.children)
		}

		if (node.id === targetId) {
			return node
		}
	}

	return null
}

// console.log(findNodeBFS(tree, 'laptops'))

// БЕЗ ДОРОГОГО SHIFT ЧЕРЕЗ УКАЗАТЕЛЬ

const findNodeBfsWithoutShift = (root, targetId) => {
	const queue = [root]
	let index = 0

	while (index < queue.length) {
		const node = queue[index++]

		if (node.children?.length) {
			queue.push(...node.children)
		}

		if (node.id === targetId) {
			return node
		}
	}

	return null
}

console.log(findNodeBfsWithoutShift(tree, 'tshirts'))
