const graph = {
	a: ['b', 'c'],
	b: ['e'],
	c: ['d', 'f'],
	d: ['e'],
	e: ['g'],
	f: ['e'],
	g: [],
}


const dfsIterative = (graph, start) => {
	const visited = new Set()
	const stack = [start]

	while (stack.length > 0) {
		const node = stack.pop()
		if (!visited.has(node)) {
			visited.add(node)

			for (let neighbor of graph[node]) {
				if (!visited.has(neighbor)) {
					stack.push(neighbor)
				}
			}
		}
	}
}
