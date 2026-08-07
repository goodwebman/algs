var cloneGraph = function(node) {
    if (!node) return null;

    const visited = new Map();
    const queue = [node];
    visited.set(node, new Node(node.val));

    while (queue.length) {
        const n = queue.shift();

        for (const neighbor of n.neighbors) {
            if (!visited.has(neighbor)) {
                visited.set(neighbor, new Node(neighbor.val));
                queue.push(neighbor);
            }
            visited.get(n).neighbors.push(visited.get(neighbor));
        }
    }

    return visited.get(node);
};
