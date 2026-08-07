const graph = {
	a: ['b', 'c'],
	b: ['e'],
	c: ['d', 'f'],
	d: ['e'],
	e: ['g'],
	f: ['e'],
	g: [],
}

const bfs = (graph, start, end) => {
	const visited = new Set()
	visited.add(start)

	const queue = [start]

	while (queue.length > 0) {
		const node = queue.shift()

		for (let neighbor of graph[node]) {
			if (neighbor === end) {
				return true
			}
			if (!visited.has(neighbor)) {
				visited.add(neighbor)
				queue.push(neighbor)
			}
		}
	}

	return visited
}

console.log(bfs(graph, 'a', 'g'))
