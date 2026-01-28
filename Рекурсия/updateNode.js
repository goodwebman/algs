const tree = [
	{
		id: 1,
		value: 'A',
		children: [
			{
				id: 2,
				value: 'B',
				children: [],
			},
		],
	},
]

function updateNode(nodes, targetId, newValue) {
	return nodes.map(node => {
		if (node.id === targetId) {
			return {
				...node,
				value: newValue,
			}
		}

		if (node.children?.length) {
			return {
				...node,
				children: updateNode(node.children, targetId, newValue),
			}
		}

		return node
	})
}
