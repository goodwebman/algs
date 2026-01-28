const menu = [
	{
		id: 1,
		title: 'Dashboard',
		children: [],
	},
	{
		id: 2,
		title: 'Products',
		children: [
			{ id: 3, title: 'Phones', children: [] },
			{
				id: 4,
				title: 'Laptops',
				children: [{ id: 5, title: 'Macbook', children: [] }],
			},
		],
	},
]

function findMenuItem(items, id) {
	for (const item of items) {
		if (item.id === id) {
			return item
		}

		if (item.children?.length) {
			const found = findMenuItem(item.children, id)
			if (found) return found
		}
	}

	return null
}

console.log(findMenuItem(menu, 5))