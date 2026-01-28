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




// const bfsPath = (graph, start, end) => {
// 	const visited = new Set()
// 	const queue = [start]
// 	const parent = {}

// 	visited.add(start)
// 	parent[start] = null

// 	while (queue.length) {
// 		const node = queue.shift()

// 		for (let neighbor of graph[node]) {
// 			if (!visited.has(neighbor)) {
// 				visited.add(neighbor)
// 				parent[neighbor] = node
// 				queue.push(neighbor)

// 				if (neighbor === end) {
// 					return buildPath(parent, end)
// 				}
// 			}
// 		}
// 	}

// 	return null
// }

// const buildPath = (parent, end) => {
// 	const path = []
// 	let cur = end

// 	while (cur !== null) {
// 		path.push(cur)
// 		cur = parent[cur]
// 	}

// 	return path.reverse()
// }

// console.log(bfsPath(graph, 'a', 'g'))