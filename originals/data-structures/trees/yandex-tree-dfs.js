const tree = {
	type: 'nested',
	children: [
		{ type: 'added', value: 42 },
		{
			type: 'nested',
			children: [{ type: 'added', value: 43 }],
		},
		{ type: 'added', value: 44 },
	],
}

const getNodes = (tree, type) => {
	if (!tree) return []
	const stack = [tree]
	const result = []

	while (stack.length) {
		const node = stack.pop()
		if (node.type === type) {
			result.push(node)
		}

		if (node.children) {
			stack.push(...node.children)
		}
	}

	return result.reverse()
}

console.log(getNodes(tree, 'added'))
