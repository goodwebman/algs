export const categoryTree = {
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

const groupByLevelsSimple = root => {
	const result = []
	const queue = [root]

	while (queue.length) {
		const level = []
		const levelCount = queue.length // сколько элементов на текущем уровне

		for (let i = 0; i < levelCount; i++) {
			const node = queue.shift() // берём первый

			level.push(node.name)

			if (node.children) {
				queue.push(...node.children)
			}
		}

		result.push(level)
	}

	return result
}

// ОПТИМИЗИРОВАННЫЙ

const groupByLevels = tree => {
	const result = []
	const queue = [tree]

	let index = 0

	while (index < queue.length) {
		const levelSize = queue.length - index
		const level = []

		for (let i = 0; i < levelSize; i++) {
			const node = queue[index++]
			level.push(node.name)

			if (node.children?.length) {
				queue.push(...node.children)
			}
		}
		result.push(level)
	}

	return result
}

console.log(groupByLevels(categoryTree))
